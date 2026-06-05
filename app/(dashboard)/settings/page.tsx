"use client";

import { Camera, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

// URL till Profile API.
// Hämtas från .env.local via NEXT_PUBLIC_PROFILE_API_URL.
// Om ingen miljövariabel finns används localhost för lokal utveckling.
const PROFILE_API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL ?? "http://localhost:5244";

// Typen beskriver svaret som kommer tillbaka från Profile API.
type ProfileResponse = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string | null;
};

export default function SettingsPage() {
  const router = useRouter();

  // Ref används för att kunna öppna file input när användaren klickar på kamera-knappen.
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State för profilbild och formulärfält.
  const [profileImage, setProfileImage] = useState("/avatars/main.jpg");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  // State för feedback till användaren.
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hämtar användarens profil när sidan laddas.
  useEffect(() => {
    async function loadProfile() {
      try {
        // JWT-token används för att Profile API ska veta vilken användare som är inloggad.
        const token = localStorage.getItem("token") ?? "";

        const response = await fetch(`${PROFILE_API_URL}/api/profiles/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setStatusMessage("Could not load profile.");
          return;
        }

        const profile: ProfileResponse = await response.json();

        // Fyller formuläret med data från Profile API.
        setFirstName(profile.firstName ?? "");
        setLastName(profile.lastName ?? "");
        setEmail(profile.email ?? "");

        // Om användaren har en profilbild sparad används den istället för standardbilden.
        if (profile.profileImageUrl) {
          setProfileImage(profile.profileImageUrl);
        }
      } catch {
        setStatusMessage("Could not load profile.");
      }
    }

    loadProfile();
  }, []);

  // Hanterar uppladdning av profilbild.
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validerar att endast tillåtna bildformat kan laddas upp.
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP files are allowed.");
      return;
    }

    // Skapar en lokal preview av bilden direkt i webbläsaren.
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    try {
      const token = localStorage.getItem("token") ?? "";

      // Skickar den nya profilbildens URL till Profile API.
      await fetch(`${PROFILE_API_URL}/api/profiles/me/profile-image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileImageUrl: imageUrl,
        }),
      });
    } catch {
      setStatusMessage("Could not update profile image.");
    }
  };

  // Sparar användarens profiländringar via Profile API.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token") ?? "";

      const response = await fetch(`${PROFILE_API_URL}/api/profiles/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          description,
        }),
      });

      if (!response.ok) {
        setStatusMessage("Could not save profile.");
        return;
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

        <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          Need Help?
        </button>
      </div>

      <nav className="relative z-[9999] flex items-center gap-6 text-sm">
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className="rounded-lg bg-slate-900 px-5 py-2 text-white"
        >
          General
        </button>

        <button
          type="button"
          onClick={() => router.push("/settings/team")}
          className="rounded-lg px-5 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          Team
        </button>

        <button
          type="button"
          onClick={() => router.push("/settings/password")}
          className="rounded-lg px-5 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          Password
        </button>

        <button
          type="button"
          onClick={() => router.push("/settings/notification")}
          className="rounded-lg px-5 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          Notification
        </button>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[320px_720px]">
        <aside className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-500" />

          <div className="-mt-12 flex flex-col items-center px-6 pb-6">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />

              <Image
                src={profileImage}
                alt="Profile avatar"
                width={88}
                height={88}
                className="rounded-full border-4 border-white object-cover"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 z-10 flex size-7 items-center justify-center rounded-full bg-orange-500 text-white"
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
          </div>
        </aside>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex size-14 items-center justify-center rounded-xl border bg-slate-50 text-slate-400">
              <User className="size-6" />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700"
            >
              Upload photo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                First name *
              </label>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Last name *
              </label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
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

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-orange-500 px-8 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}