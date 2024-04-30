import { useEffect, useState } from "react";
import { type Settings } from "~/server/domain/client/settings";
import { sendServiceWorkerReminderTime } from "../lib/pwa/serviceWorker.service";
import { useToast } from "../lib/ui/hooks";
import { getSettings } from "../lib/ui/store/settings";

export default function SettingsComp() {
  const [Settings, setSettings] = useState<Settings>(getSettings());

  const showToast = useToast();

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function handleChangeFlashCardRandomize(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setSettings({ ...Settings, randomizeCards: e.target.checked });
  }

  function handleSave() {
    setSettings(Settings);
    try {
      sendServiceWorkerReminderTime(Settings.reminderTime);
    } catch (error: unknown) {
      console.error(error);
    }
    showToast(`Settings successfully saved`, "success");
  }

  return (
    <div className="my-20 mx-5 flex min-h-screen w-full flex-col items-center justify-start space-y-20">
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
          <button className="btn-success btn-outline btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
