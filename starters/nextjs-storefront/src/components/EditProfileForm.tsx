"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/auth";
import type { AuthenticatedContact } from "@/lib/auth";

interface EditProfileFormProps {
  contact: AuthenticatedContact;
}

export function EditProfileForm({ contact }: EditProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [firstName, setFirstName] = useState(contact.first_name ?? "");
  const [lastName, setLastName] = useState(contact.last_name ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");

  const handleCancel = useCallback(() => {
    setFirstName(contact.first_name ?? "");
    setLastName(contact.last_name ?? "");
    setPhone(contact.phone ?? "");
    setIsEditing(false);
    setMessage(null);
  }, [contact]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);

      startTransition(async () => {
        const ok = await updateProfile({
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
        });

        if (ok) {
          setMessage({ type: "success", text: "Profile updated successfully!" });
          setIsEditing(false);
          router.refresh();
        } else {
          setMessage({
            type: "error",
            text: "Failed to update profile. Please try again.",
          });
        }
      });
    },
    [firstName, lastName, phone, router]
  );

  const fullName = [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-100 text-green-700"
              : "bg-red-50 border border-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="edit-first-name"
                className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5"
              >
                First Name
              </label>
              <input
                id="edit-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                placeholder="First name"
              />
            </div>

            <div>
              <label
                htmlFor="edit-last-name"
                className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Last Name
              </label>
              <input
                id="edit-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                placeholder="Last name"
              />
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Email
              </label>
              <input
                id="edit-email"
                type="email"
                value={contact.email}
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="edit-phone"
                className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Phone
              </label>
              <input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Email
              </dt>
              <dd className="text-sm text-gray-900">{contact.email}</dd>
            </div>

            {fullName && (
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Name
                </dt>
                <dd className="text-sm text-gray-900">{fullName}</dd>
              </div>
            )}

            {contact.phone && (
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Phone
                </dt>
                <dd className="text-sm text-gray-900">{contact.phone}</dd>
              </div>
            )}

            {contact.lifecycle_stage && (
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Status
                </dt>
                <dd className="text-sm text-gray-900 capitalize">
                  {contact.lifecycle_stage}
                </dd>
              </div>
            )}
          </div>

          <div className="pt-5">
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setMessage(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
