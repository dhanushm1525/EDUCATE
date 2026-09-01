import { GraduationCap } from "lucide-react";

interface AuthLogoProps {
    size?: "sm" | "md";
}

function AuthLogo({
    size = "md",
}: AuthLogoProps) {
    const isSmall = size === "sm";

    return (
        <div className="flex items-center gap-2.5">

            <div
                className={`
                    rounded-lg
                    bg-indigo-600
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-md
                    shadow-indigo-600/30
                    ${isSmall ? "w-8 h-8" : "w-9 h-9"}
                `}
            >
                <GraduationCap
                    className={
                        isSmall
                            ? "w-5 h-5"
                            : "w-5 h-5"
                    }
                />
            </div>

            <span
                className={
                    isSmall
                        ? "text-lg font-black tracking-wider text-white"
                        : "text-xl font-black tracking-wider text-white"
                }
            >
                EDUCATE
            </span>

        </div>
    );
}

export default AuthLogo;