"use client";

import { Mail, Plus, Trash2, Users } from "lucide-react";

const members = [
  { name: "Samantha William", email: "samantha@gmail.com", role: "Student" },
  { name: "Adam Smith", email: "adamsmith@gmail.com", role: "Student" },
  { name: "Deven Lane", email: "info@devenlane.com", role: "Student" },
  { name: "Annette Black", email: "account@annette.com", role: "Student" },
];

export default function SettingsTeamPage() {
  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Team</h1>

        <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          Need Help?
        </button>
      </div>

      <div className="flex gap-6 text-sm">
        <a href="/settings" className="px-5 py-2 text-slate-400">General</a>
        <a href="/settings/team" className="rounded-lg bg-slate-900 px-5 py-2 text-white">Team</a>
        <a href="/settings/password" className="px-5 py-2 text-slate-400">Password</a>
        <a href="/settings/notification" className="px-5 py-2 text-slate-400">Notification</a>
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <div>
          <h2 className="font-bold text-slate-900">Invite team member</h2>
          <p className="mt-1 text-xs text-slate-400">
            Get your study group up and running faster by inviting your team to collaborate.
          </p>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
              <Mail className="size-4 text-slate-400" />
              <input
                placeholder="name@example.com"
                className="w-full text-sm outline-none"
              />
            </div>

            <button className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white">
              Send Invite
            </button>
          </div>

          <button className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Plus className="size-4" />
            Add another
          </button>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <div>
          <h2 className="font-bold text-slate-900">Team members</h2>
          <p className="mt-1 text-xs text-slate-400">
            Manage your existing team and change roles/permissions.
          </p>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-[40px_1fr_160px_80px] px-4 pb-3 text-xs font-semibold text-slate-500">
            <span />
            <span>Name</span>
            <span>Role</span>
            <span />
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.email}
                className="grid grid-cols-[40px_1fr_160px_80px] items-center rounded-xl bg-slate-50 px-4 py-3"
              >
                <input type="checkbox" className="size-4" />

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-400">{member.email}</p>
                  </div>
                </div>

                <span className="text-sm text-slate-500">{member.role}</span>

                <button className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                  <Trash2 className="size-3" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}