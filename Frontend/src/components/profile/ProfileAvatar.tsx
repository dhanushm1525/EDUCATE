import { useState } from "react";


interface ProfileAvatarProps {
  firstName: string;

  lastName: string;

  avatar?: string;

  size?: "sm" | "md" | "lg";
}


export default function ProfileAvatar({
  firstName,
  lastName,
  avatar,
  size = "md",
}: ProfileAvatarProps) {

  const [imageError, setImageError] =
    useState(false);


  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();


  const sizeClasses = {

    sm: "w-9 h-9 text-xs",

    md: "w-14 h-14 text-lg",

    lg: "w-28 h-28 text-3xl",

  };


  const hasAvatar =
    typeof avatar === "string" &&
    avatar.trim().length > 0 &&
    !imageError;


  if (hasAvatar) {

    return (

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

    );

  }


  return (

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

}