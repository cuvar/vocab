import { type Tag } from "@prisma/client";
import { useEffect, useState } from "react";
import { type Settings } from "~/server/domain/client/settings";
import TagItem from "../comp/TagItem";
import { api } from "../lib/api";
import { sendServiceWorkerReminderTime } from "../lib/pwa/serviceWorker.service";
import { useToast } from "../lib/ui/hooks";
import { plusIcon } from "../lib/ui/icons";
import { getSettings, storeSettings } from "../lib/ui/store/settings";

type Props = {
  collectionId: string;
};

export default function CollectionSettings(props: Props) {
  const [Settings, setSettings] = useState<Settings>(
    getSettings(props.collectionId)
  );
  const [tags, setTags] = useState<Tag[]>([]);
  const [addMode, setAddMode] = useState(false);

  const showToast = useToast();

  const allQuery = api.tag.getAll.useQuery(
    {
      collectionId: props.collectionId,
    },
    {
      onSuccess: (data) => setTags(data),
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setSettings(getSettings(props.collectionId));
  }, []);

  function handleChangeFlashCardRandomize(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setSettings({ ...Settings, randomizeCards: e.target.checked });
  }

  function handleSave() {
    storeSettings(Settings, props.collectionId);
    try {
      sendServiceWorkerReminderTime(Settings.reminderTime);
    } catch (error: unknown) {
      console.error(error);
    }
    showToast(`Settings successfully saved`, "success");
  }

  function handleAdd() {
    setAddMode(true);
  }

  function onDoneEditing() {
    setAddMode(false);
    void (async () => {
      await allQuery.refetch();
    })();
  }

  return (
    <div className="min-h-screen">
      <div className="my-20 mx-5 flex w-full flex-col items-center justify-start space-y-20">
        <h1 className="mt-5 mb-2 text-2xl tracking-tight">Settings</h1>
        <div className="w-full flex-col items-start justify-start space-y-8">
          <div className="flex w-full flex-col space-y-4">
            <h2 className="text-xl font-bold">Flash cards</h2>
            <hr />
            <div className="form-control">
              <label className="label w-72 cursor-pointer space-x-2">
                <span className="label-text">Randomize flash card words</span>
                <input
                  type="checkbox"
                  checked={Settings.randomizeCards}
                  onChange={handleChangeFlashCardRandomize}
                  className="checkbox"
                />
              </label>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <button
              className="btn-success btn-outline btn"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-start gap-12 px-4">
        <h1 className="mt-5 mb-2 text-2xl tracking-tight">
          Tags: {tags.length}
        </h1>
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-end">
            <button className="btn-ghost btn" onClick={handleAdd}>
              {plusIcon} Add Tag
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            {tags.map((tag) => (
              <TagItem
                key={tag.name}
                id={tag.id}
                name={tag.name}
                description={tag.description}
                doneHandler={() => onDoneEditing()}
                collectionId={props.collectionId}
              />
            ))}
            {addMode && (
              <TagItem
                name={""}
                description={""}
                doneHandler={() => onDoneEditing()}
                collectionId={props.collectionId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
