import { useState } from "react";

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  onChangeAvatar?: () => void;
  isUploading?: boolean;
}

export default function ProfileAvatar({
  firstName,
  lastName,
  avatar,
  size = "md",
  onChangeAvatar,
  isUploading = false,
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-14 h-14 text-lg",
    lg: "w-28 h-28 text-3xl",
  };

  const hasAvatar =
    typeof avatar === "string" &&
    avatar.trim().length > 0 &&
    !imageError;

  const avatarElement = hasAvatar ? (
    <img
      src={avatar}
      alt={`${firstName} ${lastName}`}
      onError={() => setImageError(true)}
      className={`
        ${sizeClasses[size]}
        rounded-full
        object-cover
        border-2
        border-indigo-500
      `}
    />
  ) : (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-linear-to-br
        from-blue-600
        to-indigo-600
        flex
        items-center
        justify-center
        text-white
        font-semibold
        border-2
        border-indigo-400
      `}
    >
      {initials}
    </div>
  );

  return (
    <div className="relative inline-block">
      {avatarElement}

      {onChangeAvatar && (
        <button
          type="button"
          onClick={onChangeAvatar}
          disabled={isUploading}
          className="
            absolute
            bottom-0
            right-0
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border-2
            border-[#162032]
            bg-indigo-600
            text-white
            transition
            hover:bg-indigo-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
          aria-label="Change profile image"
        >
          {isUploading ? "..." : "✎"}
        </button>
      )}
    </div>
  );
}