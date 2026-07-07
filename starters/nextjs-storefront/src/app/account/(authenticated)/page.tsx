import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedContact } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { EditProfileForm } from "@/components/EditProfileForm";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function AccountProfilePage() {
  const contact = await getAuthenticatedContact();

  if (!contact) {
    redirect("/account/login");
  }

  const memberSince = new Date(contact.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
    }
  );

  const fullName = [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Avatar + name header */}
        <div className="bg-gray-900 px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {(contact.first_name?.[0] || contact.email[0]).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">
                {fullName || "Customer"}
              </h2>
              <p className="text-white/60 text-sm">
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Editable details */}
        <div className="p-8 space-y-6">
          <EditProfileForm contact={contact} />

          <div className="border-t border-gray-100 pt-6">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
