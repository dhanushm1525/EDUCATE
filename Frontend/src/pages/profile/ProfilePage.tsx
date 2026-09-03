import type { UserProfile } from "../../types/user";

interface ProfilePageProps {
  profile: UserProfile;
  title?: string;
}

export default function ProfilePage({
  profile,
  title = "My Profile",
}: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-[#0B1120] p-6 text-white md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your personal information.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#162032] p-6">
          <div className="flex flex-col gap-5 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.firstName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <>
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="mt-1 text-sm text-slate-400">{profile.email}</p>

              <span className="mt-3 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs capitalize text-indigo-400">
                {profile.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-slate-500">First Name</p>
              <p className="text-sm text-slate-200">{profile.firstName}</p>
            </div>

            <div>
              <p className="mb-1 text-xs text-slate-500">Last Name</p>
              <p className="text-sm text-slate-200">{profile.lastName}</p>
            </div>

            <div>
              <p className="mb-1 text-xs text-slate-500">Email Address</p>
              <p className="text-sm text-slate-200">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}