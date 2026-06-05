"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL ?? "http://localhost:5000";

const notificationGroups = [
  {
    key: "comments",
    title: "Comments",
    description:
      "These are notifications for comments on your posts and replies to your comments.",
  },
  {
    key: "tags",
    title: "Tags",
    description:
      "These are notifications for when someone tags you in a comment, post or story.",
  },
  {
    key: "reminders",
    title: "Reminders",
    description:
      "These are notifications to remind you of updates you might have missed.",
  },
  {
    key: "activity",
    title: "More activity about you",
    description:
      "These are notifications for posts on your profile, like and other reactions to your posts, and more.",
  },
];

type NotificationSetting = {
  key: string;
  email: boolean;
  sms: boolean;
};

export default function SettingsNotificationPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(
    notificationGroups.map((group, index) => ({
      key: group.key,
      email: index === 0,
      sms: false,
    }))
  );

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_URL}/api/notification-settings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setSettings(data);
      } catch {
        setStatusMessage("Could not load notification settings.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateSetting(
    key: string,
    channel: "email" | "sms",
    checked: boolean
  ) {
    setSettings((current) =>
      current.map((setting) =>
        setting.key === key ? { ...setting, [channel]: checked } : setting
      )
    );
  }

  async function saveSettings() {
    try {
      setIsLoading(true);
      setStatusMessage("");

      const response = await fetch(`${API_URL}/api/notification-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        setStatusMessage("Could not save notification settings.");
        return;
      }

      setStatusMessage("Notification settings saved.");
    } catch {
      setStatusMessage("Could not save notification settings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

        <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          Need Help?
        </button>
      </div>

      <div className="flex gap-6 text-sm">
        <a href="/settings" className="px-5 py-2 text-slate-400">
          General
        </a>
        <a href="/settings/team" className="px-5 py-2 text-slate-400">
          Team
        </a>
        <a href="/settings/password" className="px-5 py-2 text-slate-400">
          Password
        </a>
        <a
          href="/settings/notification"
          className="rounded-lg bg-slate-900 px-5 py-2 text-white"
        >
          Notification
        </a>
      </div>

      <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-sm xl:grid-cols-[260px_1fr]">
        <div>
          <h2 className="font-bold text-slate-900">General details</h2>
          <p className="mt-1 text-xs text-slate-400">
            Select when you&apos;ll be notified when the following change occurs.
          </p>
        </div>

        <div>
          <div className="divide-y divide-slate-100">
            {notificationGroups.map((group) => {
              const setting = settings.find((item) => item.key === group.key);

              return (
                <div
                  key={group.title}
                  className="grid gap-4 py-5 md:grid-cols-[1fr_140px]"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">{group.title}</h3>
                    <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-400">
                      {group.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={setting?.email ?? false}
                        onChange={(event) =>
                          updateSetting(
                            group.key,
                            "email",
                            event.target.checked
                          )
                        }
                        className="accent-orange-500"
                      />
                      Email
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={setting?.sms ?? false}
                        onChange={(event) =>
                          updateSetting(group.key, "sms", event.target.checked)
                        }
                        className="accent-orange-500"
                      />
                      SMS
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={saveSettings}
              disabled={isLoading}
              className="rounded-lg bg-orange-500 px-8 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>

            {statusMessage && (
              <p className="text-sm text-slate-500">{statusMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}