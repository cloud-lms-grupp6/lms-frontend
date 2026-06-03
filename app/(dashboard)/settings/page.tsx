"use client";

import { Camera, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

        <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          Need Help?
        </button>
      </div>

      <div className="flex gap-6 text-sm">
        <Link
          href="/settings"
          className="rounded-lg bg-slate-900 px-5 py-2 text-white"
        >
          General
        </Link>

        <Link
          href="/settings/team"
          className="px-5 py-2 text-slate-400 hover:text-slate-700"
        >
          Team
        </Link>

        <Link
          href="/settings/password"
          className="px-5 py-2 text-slate-400 hover:text-slate-700"
        >
          Password
        </Link>

        <Link
          href="/settings/notification"
          className="px-5 py-2 text-slate-400 hover:text-slate-700"
        >
          Notification
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_720px]">
        <aside className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-500" />

          <div className="-mt-12 flex flex-col items-center px-6 pb-6">
            <div className="relative">
              <Image
                src="/avatars/main.jpg"
                alt="Profile avatar"
                width={88}
                height={88}
                className="rounded-full border-4 border-white object-cover"
              />

              <button className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-orange-500 text-white">
                <Camera className="size-3.5" />
              </button>
            </div>

            <h2 className="mt-3 text-lg font-bold text-slate-900">
              Hasan Mahmud
            </h2>

            <span className="mt-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
              Student
            </span>
          </div>
        </aside>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex size-14 items-center justify-center rounded-xl border bg-slate-50 text-slate-400">
              <User className="size-6" />
            </div>

            <button className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700">
              Upload photo
            </button>
          </div>

          <form className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                First name *
              </label>

              <input
                defaultValue="Hasan"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Last name *
              </label>

              <input
                defaultValue="Mahmud"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                defaultValue="hasan@gmail.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Phone number
              </label>

              <input
                placeholder="Enter phone number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                rows={5}
                defaultValue="A passionate UI/UX Designer with hands-on experience designing intuitive, user-centered digital products across mobile and web platforms."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-6 py-2 text-sm font-medium text-slate-400"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-lg bg-orange-500 px-8 py-2 text-sm font-medium text-white"
              >
                Save
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}