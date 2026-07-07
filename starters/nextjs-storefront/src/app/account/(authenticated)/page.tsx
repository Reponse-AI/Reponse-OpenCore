import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedContact } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

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

        {/* Details */}
        <div className="p-8 space-y-6">
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

          <div className="border-t border-gray-100 pt-6">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
