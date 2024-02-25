import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { sendServiceWorkerReminderTime } from "../../../server/src/service/serviceWorker.service";
import { toastTextAtom, toastTypeAtom } from "../../../server/src/store";
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

  function handleChangeReminderTime(e: React.ChangeEvent<HTMLInputElement>) {
    setSettingsData({ ...settingsData, reminderTime: e.target.value });
  }

  function handleChangeFlashCardRandomize(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setSettingsData({ ...settingsData, randomizeCards: e.target.checked });
  }

  function handleChangeSendNotifications(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (e.target.checked === false) {
      setSettingsData({
        ...settingsData,
        sendWOTDNotifications: e.target.checked,
      });
      return;
    }

    void (async () => {
      try {
        const permitted = await checkNotificationsPermission();
        if (permitted === false) {
          return;
        }
        setSettingsData({
          ...settingsData,
          sendWOTDNotifications: true,
        });
      } catch (error) {
        showToast(`Cannot enable permissions`, "error");
      }
    })();
  }

  function handleSave() {
    setSettings(settingsData);
    try {
      sendServiceWorkerReminderTime(settingsData.reminderTime);
    } catch (error: unknown) {
      console.error(error);
    }
    showToast(`Settings successfully saved`, "success");
  }

  async function checkNotificationsPermission() {
    if (!window.Notification) {
      showToast(`Your browser does not support notifications`, "error");
      return false;
    }
    if (Notification.permission === "granted") {
      showToast(`Permissions already granted`, "success");
      return true;
    }

    try {
      const hasPermissions = await requestPermissions();
      return hasPermissions ?? false;
    } catch (error) {}
  }

  async function requestPermissions() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        showToast(`Permissions denied`, "error");
        return false;
      }

      showToast(`Permissions granted`, "success");
      return true;
    } catch (error) {
      showToast(`Cannot enable permissions`, "error");
    }
  }

  function handleRequestPermission() {
    void (async () => {
      try {
        const permitted = await requestPermissions();
        setSettingsData({
          ...settingsData,
          sendWOTDNotifications: permitted ?? false,
        });
      } catch (error) {
        showToast(`Cannot enable permissions`, "error");
      }
    })();
  }

  function showToast(text: string, type: "success" | "error") {
    setToastType(type);
    setToastText(text);
    setTimeout(() => {
      setToastText("");
    }, 1500);
  }

  return (
    <div className="my-20 mx-5 flex min-h-screen w-full flex-col items-center justify-start space-y-20">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">Settings</h1>
      <div className="w-full flex-col items-start justify-start space-y-8">
        <div className="flex w-full flex-col space-y-4">
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
            <button
              className="btn-primary btn w-40"
              onClick={handleRequestPermission}
            >
              Request permissions
            </button>
          </div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">WOTD Reminder time</span>
            </div>
            <input
              type="time"
              value={settingsData.reminderTime}
              onChange={handleChangeReminderTime}
              className="input-bordered input w-40"
              name="reminder"
            />
          </label>
        </div>
        <div className="flex w-full flex-col">
          <h2 className="text-xl font-bold">Flash cards</h2>
          <div className="form-control">
            <label className="label w-72 cursor-pointer space-x-2">
              <span className="label-text">Randomize flash card words</span>
              <input
                type="checkbox"
                checked={settingsData.randomizeCards}
                onChange={handleChangeFlashCardRandomize}
                className="checkbox"
              />
            </label>
          </div>
        </div>
        <button className="btn-success btn-outline btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
