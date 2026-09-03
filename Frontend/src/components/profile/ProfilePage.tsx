import { useEffect, useState } from "react";
import { userService } from "../../services/user.service";
import type { UserProfile } from "../../types/user";
import ProfileAvatar from "./ProfileAvatar";

interface ProfilePageProps {
  title?: string;
}

export default function ProfilePage({
  title = "My Profile",
}: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await userService.getMyProfile();
       
        setProfile(response.data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120]">
        <span className="text-sm text-slate-400">Loading profile...</span>
      </div>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120]">
        <div className="text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  /*
   * No profile
   */
  if (!profile) {
    return null;
  }

  console.log("PROFILE:", profile);
  console.log("AVATAR:", profile.avatar);

  return (
    <div className="min-h-screen bg-[#0B1120] p-6 text-white md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#162032] p-6">
          {/* Profile Header */}
          <div className="flex flex-col gap-5 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <ProfileAvatar
              firstName={profile.firstName}
              lastName={profile.lastName}
              avatar={profile.avatar}
              size="lg"
            />

            {/* User Information */}
            <div>
              <h2 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="mt-1 text-sm text-slate-400">{profile.email}</p>

              <div className="mt-3 flex gap-2">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs capitalize text-indigo-400">
                  {profile.role}
                </span>

                {profile.isVerified && (
                  <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
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

            <div>
              <p className="mb-1 text-xs text-slate-500">Account Status</p>
              <p className="text-sm capitalize text-slate-200">
                {profile.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
