import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import type { Settings } from "../types/types";
import { DEFAULT_SETTINGS } from "../utils/const";
import { getSettings, setSettings } from "../utils/store/settings";

export default function SettingsComp() {
  const [settingsData, setSettingsData] = useState<Settings>(
    getSettings() ?? DEFAULT_SETTINGS
  );

  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);

  useEffect(() => {
    if (!getSettings()) {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  function handleReminderTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSettingsData({ ...settingsData, reminderTime: e.target.value });
  }

  function handleChangeFlashCardRandomize(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!settingsData) return;
    setSettingsData({ ...settingsData, randomizeCards: e.target.checked });
  }

  function handleChangeSendNotifications(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setSettingsData({
      ...settingsData,
      sendWOTDNotifications: e.target.checked,
    });
  }

  function handleSaveReminderTime() {
    setSettings(settingsData);
    // sendServiceWorkerWordOfTheDay(wotdQuery.data, reminderTime); // todo

    setToastType("success");
    setToastText(`Settings successfully saved`);
    setTimeout(() => {
      setToastText("");
    }, 1500);
  }

  return (
    <div className="my-20 mx-5 flex min-h-screen w-full flex-col items-center justify-start space-y-20">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">Settings</h1>
      <div className="w-full flex-col items-start justify-start space-y-8">
        <div className="flex w-full flex-col">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="form-control">
            <label className="label w-72 cursor-pointer space-x-2">
              <span className="label-text">Send WOTD Notifications</span>
              <input
                type="checkbox"
                checked={settingsData.sendWOTDNotifications}
                className="checkbox"
                onChange={handleChangeSendNotifications}
              />
            </label>
          </div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">WOTD Reminder time</span>
            </div>
            <input
              type="time"
              value={settingsData.reminderTime}
              onChange={handleReminderTimeChange}
              className="input-bordered input w-40"
              name="reminder"
            />
          </label>
        </div>
        <div className="flex w-full flex-col">
          <h2 className="text-xl font-bold">Flash cards</h2>
          <div className="form-control">
            <label className="label w-72 cursor-pointer space-x-2">
              <span className="label-text">Randomize flash cards words</span>
              <input
                type="checkbox"
                checked={settingsData.randomizeCards}
                onChange={handleChangeFlashCardRandomize}
                className="checkbox"
              />
            </label>
          </div>
        </div>
        <button
          className="btn-success btn-outline btn"
          onClick={handleSaveReminderTime}
        >
          Save
        </button>
      </div>
    </div>
  );
}
