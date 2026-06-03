"use client";

const notificationGroups = [
  {
    title: "Comments",
    description:
      "These are notifications for comments on your posts and replies to your comments.",
  },
  {
    title: "Tags",
    description:
      "These are notifications for when someone tags you in a comment, post or story.",
  },
  {
    title: "Reminders",
    description:
      "These are notifications to remind you of updates you might have missed.",
  },
  {
    title: "More activity about you",
    description:
      "These are notifications for posts on your profile, like and other reactions to your posts, and more.",
  },
];

export default function SettingsNotificationPage() {
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

        <div className="divide-y divide-slate-100">
          {notificationGroups.map((group, index) => (
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
                    defaultChecked={index === 0}
                    className="accent-orange-500"
                  />
                  Email
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="accent-orange-500" />
                  SMS
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}