"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/hooks";
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

const PROFILE_API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL ?? "http://localhost:5244";

type ProfileResponse = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
};

// Profile-sidan visar användarens profilinformation, kompetenser,
// prestationer och aktuella kurser.
//
// AI användes som stöd för layoutstruktur och vissa UI-förslag.
// Designen anpassades därefter manuellt utifrån Figma-skissen.

// Huvudkomponent för profilsidan i LMS-systemet.
export default function ProfilePage() {
  const { accessToken } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const avatarSrc = profileImageUrl || "/avatars/main.jpg";

  useEffect(() => {
    async function fetchProfile() {
      if (!accessToken) return;

      try {
        const response = await fetch(`${PROFILE_API_URL}/api/profiles/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          setStatusMessage("Could not load profile.");
          return;
        }

        const profile = (await response.json()) as ProfileResponse;

        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setEmail(profile.email);
        setProfileImageUrl(profile.profileImageUrl ?? "");
      } catch {
        setStatusMessage("Could not load profile.");
      }
    }

    fetchProfile();
  }, [accessToken]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    if (!accessToken) {
      setStatusMessage("You need to be logged in to save profile.");
      return;
    }

    try {
      setIsLoading(true);

      const profileResponse = await fetch(`${PROFILE_API_URL}/api/profiles/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      });

      if (!profileResponse.ok) {
        setStatusMessage("Could not save profile.");
        return;
      }

      if (profileImageUrl.trim()) {
        const imageResponse = await fetch(
          `${PROFILE_API_URL}/api/profiles/me/profile-image`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              profileImageUrl,
            }),
          }
        );

        if (!imageResponse.ok) {
          setStatusMessage("Profile saved, but image could not be saved.");
          return;
        }
      }

      setStatusMessage("Profile saved successfully.");
    } catch {
      setStatusMessage("Could not save profile.");
    } finally {
      setIsLoading(false);
    }
  }


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
        {/* Visar användarens profilinformation, kompetenser och prestationer. */}
        <aside className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative h-32 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-500" />

          <div className="-mt-12 flex flex-col items-center px-6 pb-6">
            <div className="relative">
              {/* Profilbild för användaren. */}
              <Image
                src={avatarSrc}
                alt="Profile avatar"
                width={88}
                height={88}
                className="rounded-full border-4 border-white object-cover"
              />

              {/* Knapp för framtida uppladdning eller byte av profilbild. */}
              <button
                type="button"
                className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-orange-500 text-white"
              >
                <Camera className="size-3.5" />
              </button>
            </div>

            <h2 className="mt-3 text-lg font-bold text-slate-900">
              {firstName || "User"} {lastName}
            </h2>

            <span className="mt-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
              Student
            </span>

            <div className="mt-6 w-full">
              <h3 className="font-semibold text-slate-800">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {/* Renderar skills dynamiskt från en lista. */}
                {[
                  "APP DESIGN",
                  "WEB DESIGN",
                  "UI DESIGN",
                  "DASHBOARD",
                  "PRODUCT DESIGN",
                  "UX DESIGN",
                ].map((skill) => (
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
                {/* Renderar achievements med ikoner från lucide-react. */}
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

            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Upload photo
            </button>
          </div>

          {/* Formulär för redigering av användarens profiluppgifter. */}
          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                First name *
              </label>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Last name *
              </label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Profile image URL
              </label>
              <input
                value={profileImageUrl}
                onChange={(event) => setProfileImageUrl(event.target.value)}
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

            {statusMessage && (
              <p className="text-sm text-slate-500">{statusMessage}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-6 py-2 text-sm font-medium text-slate-400"
              >
                Cancel
              </button>

              {/* Sparar användarens profiländringar. */}
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-orange-500 px-8 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Visar användarens aktuella kurser i LMS-systemet. */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Current Courses</h2>
          <button className="text-sm font-medium text-orange-500">See All</button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {/* Renderar kurskort dynamiskt från en lista av kurser. */}
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