"use client";

import { Monitor } from "lucide-react";
import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:5097";

export default function SettingsPasswordPage() {
  // State används för att hålla koll på formulärfälten.
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // State för loading och statusmeddelanden till användaren.
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    // AI användes som stöd för att strukturera enkel frontend-validering.
    // Här kontrolleras att lösenordet uppfyller längdkravet innan API-anropet skickas.
    if (newPassword.length <= 10) {
      setStatusMessage("New password must be more than 10 characters long.");
      return;
    }

    // Kontrollerar att användaren har skrivit samma nya lösenord två gånger.
    if (newPassword !== confirmNewPassword) {
      setStatusMessage("New passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      // Skickar lösenordsändringen till Auth API.
      // Token hämtas från localStorage och skickas med som Bearer-token.
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      if (!response.ok) {
        setStatusMessage("Could not change password.");
        return;
      }

      // Rensar formuläret efter lyckad ändring.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setStatusMessage("Password changed successfully.");
    } catch {
      setStatusMessage("Could not change password.");
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

      {/* Enkel navigation mellan olika settings-sidor. */}
      <div className="flex gap-6 text-sm">
        <a href="/settings" className="px-5 py-2 text-slate-400">
          General
        </a>

        <a href="/settings/team" className="px-5 py-2 text-slate-400">
          Team
        </a>

        <a
          href="/settings/password"
          className="rounded-lg bg-slate-900 px-5 py-2 text-white"
        >
          Password
        </a>

        <a href="/settings/notification" className="px-5 py-2 text-slate-400">
          Notification
        </a>
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <div>
          <h2 className="font-bold text-slate-900">Password</h2>
          <p className="mt-1 text-xs text-slate-400">
            Please enter your current password to change your password.
          </p>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Password</h3>

          <p className="mt-1 text-xs text-slate-400">
            Change password. Verification code will be sent to your email
            address.
          </p>

          {/* Formulär för att byta lösenord. */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Current password*</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">New password*</label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                required
              />

              <p className="mt-1 text-xs text-slate-400">
                Your new password must be more than 10 characters long.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">
                Confirm new password*
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(event) =>
                  setConfirmNewPassword(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                required
              />
            </div>

            {/* Visar status, exempelvis felmeddelande eller lyckad ändring. */}
            {statusMessage && (
              <p className="text-sm text-slate-500">{statusMessage}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setStatusMessage("");
                }}
                className="rounded-lg bg-slate-100 px-5 py-2 text-sm text-slate-400"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-orange-500 px-5 py-2 text-sm text-white disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save & Next"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <div>
          <h2 className="font-bold text-slate-900">Login Activities</h2>

          <p className="mt-1 text-xs text-slate-400">
            See your login activities
          </p>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Where you&apos;re logged in
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            We&apos;ll alert you via email if there is any unusual activity on
            your account.
          </p>

          {/* Statisk lista för inloggningsaktiviteter enligt Figma-designen. */}
          <div className="mt-6 space-y-4">
            {[
              "Mac - Stockholm, SE, Sweden",
              "Mac - Uppsala, SE, Sweden",
              "Mac - Stockholm, SE, Sweden",
            ].map((device, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-slate-100 pb-4"
              >
                <Monitor className="size-5 text-slate-500" />

                <div>
                  <p className="text-sm font-medium">{device}</p>
                  <p className="text-xs text-slate-400">
                    Chrome · Active Now
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}