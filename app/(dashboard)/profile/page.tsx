"use client";

import Image from "next/image";
import {
  Award,
  Bell,
  Camera,
  Flame,
  Medal,
  ShieldCheck,
  Star,
  Trophy,
  User,
  Users,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

        <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
          Need Help?
        </button>
      </div>

      <div className="flex gap-6 text-sm">
        <button className="rounded-lg bg-slate-900 px-5 py-2 text-white">
          General
        </button>
        <button className="px-5 py-2 text-slate-400">Team</button>
        <button className="px-5 py-2 text-slate-400">Password</button>
        <button className="px-5 py-2 text-slate-400">Notification</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_720px]">
        <aside className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative h-32 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-500" />

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

            <div className="mt-6 w-full">
              <h3 className="font-semibold text-slate-800">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["APP DESIGN", "WEB DESIGN", "UI DESIGN", "DASHBOARD", "PRODUCT DESIGN", "UX DESIGN"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 w-full">
              <h3 className="font-semibold text-slate-800">Achievements</h3>
              <div className="mt-3 flex gap-3">
                {[Medal, Award, Star, Flame, Trophy].map((Icon, index) => (
                  <div
                    key={index}
                    className="flex size-9 items-center justify-center rounded-full bg-orange-100 text-orange-500"
                  >
                    <Icon className="size-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 w-full">
              <h3 className="font-semibold text-slate-800">Bio</h3>
              <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
                A passionate UI/UX Designer with hands-on experience designing
                intuitive, user-centered digital products across mobile and web
                platforms.
              </p>
            </div>
          </div>
        </aside>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex size-14 items-center justify-center rounded-xl border bg-slate-50 text-slate-400">
              <User className="size-6" />
            </div>

            <button className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Last name *
              </label>
              <input
                defaultValue="Mahmud"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                defaultValue="hasan@gmail.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Profile image URL
              </label>
              <input
                placeholder="https://example.com/profile.jpg"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                rows={5}
                defaultValue="A passionate UI/UX Designer with hands-on experience designing intuitive, user-centered digital products across mobile and web platforms."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-relaxed outline-none focus:border-orange-400"
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
                className="rounded-lg bg-orange-500 px-8 py-2 text-sm font-medium text-white hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Current Courses</h2>
          <button className="text-sm font-medium text-orange-500">See All</button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { title: "UI/UX Design", meta: "12 lessons", Icon: ShieldCheck },
            { title: "Team Collaboration", meta: "8 lessons", Icon: Users },
            { title: "Notifications", meta: "5 lessons", Icon: Bell },
          ].map((course) => (
            <div key={course.title} className="rounded-2xl border p-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <course.Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{course.meta}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}