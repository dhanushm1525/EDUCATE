import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { userService } from "../../services/user.service";
import { storageService } from "../../services/storage.service";

import type { UserProfile } from "../../types/user";

import ProfileAvatar from "./ProfileAvatar";

import { useToastStore } from "../../store/toastStore";
import { getApiErrorMessage } from "../../utils/apiError";

interface ProfilePageProps {
  title?: string;
}

export default function ProfilePage({
  title = "My Profile",
}: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const response = await userService.getMyProfile();

        setProfile(response.data);
      } catch (error) {
        addToast(getApiErrorMessage(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [addToast]);

  const handleSelectAvatar = () => {
    if (isUploadingAvatar) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      addToast("Only JPEG, PNG, and WebP images are allowed", "error");

      event.target.value = "";
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // 1. Generate the presigned upload URL
      const uploadResponse = await storageService.generateProfileImageUploadUrl(
        {
          fileName: file.name,
          contentType: file.type,
        },
      );

      const { uploadUrl, key } = uploadResponse.data;

      // 2. Upload the image directly to S3
      await storageService.uploadFileToS3(uploadUrl, file);

      // 3. Save the S3 key in the database
      await storageService.updateProfileImage(key);

      // 4. Fetch the profile again.
      // The backend should convert the S3 key into
      // a presigned download URL.
      const refreshedProfile = await userService.getMyProfile();

      setProfile(refreshedProfile.data);

      addToast("Profile image updated successfully", "success");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsUploadingAvatar(false);

      // Allows selecting the same image again
      event.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120]">
        <span className="text-sm text-slate-400">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B1120] p-6 text-white md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{title}</h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your personal information.
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* Profile card */}
        <div className="rounded-2xl border border-slate-800 bg-[#162032] p-6">
          {/* Profile header */}
          <div className="flex flex-col gap-5 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
            <ProfileAvatar
              firstName={profile.firstName}
              lastName={profile.lastName}
              avatar={profile.avatar}
              size="lg"
              onChangeAvatar={handleSelectAvatar}
              isUploading={isUploadingAvatar}
            />

            <div>
              <h2 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="mt-1 text-sm text-slate-400">{profile.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
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

          {/* Profile details */}
          <div className="grid gap-6 py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                First Name
              </p>

              <p className="mt-2 text-sm text-slate-200">{profile.firstName}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Last Name
              </p>

              <p className="mt-2 text-sm text-slate-200">{profile.lastName}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email Address
              </p>

              <p className="mt-2 text-sm text-slate-200">{profile.email}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Role
              </p>

              <p className="mt-2 text-sm capitalize text-slate-200">
                {profile.role}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Account Status
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {profile.isVerified ? "Verified" : "Not verified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                User ID
              </p>

              <p className="mt-2 break-all text-sm text-slate-200">
                {profile.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
