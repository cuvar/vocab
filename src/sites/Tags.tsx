import { useState } from "react";
import { api } from "../../server/api/api";
import TagItem from "../comp/TagItem";
import { type Tag } from "../types/types";
import { plusIcon } from "../utils/icons";

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [addMode, setAddMode] = useState(false);

  const allQuery = api.tag.getAll.useQuery(undefined, {
    onSuccess: (data) => setTags(data),
    refetchOnWindowFocus: false,
  });

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
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mb-2 mt-5 text-2xl tracking-tight">Tags: {tags.length}</h1>
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-end">
          <button className="btn btn-ghost" onClick={handleAdd}>
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
            />
          ))}
          {addMode && (
            <TagItem
              name={""}
              description={""}
              doneHandler={() => onDoneEditing()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
