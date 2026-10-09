import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {

    children: ReactNode;

    variant?:
        | "primary"
        | "secondary"
        | "danger"
        | "ghost";

    size?: "sm" | "md" | "lg";

    loading?: boolean;
}

const variantClasses = {
    primary:
        "bg-blue-500 hover:bg-blue-600 text-white",

    secondary:
        "bg-slate-800 hover:bg-slate-700 text-slate-200",

    danger:
        "bg-red-500 hover:bg-red-600 text-white",

    ghost:
        "bg-transparent hover:bg-slate-800 text-slate-300",
};

const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    ...props
}: ButtonProps) {

    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-md
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${props.className ?? ""}
            `}
        >
            {loading && (
                <span
                    className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-current
                        border-t-transparent
                    "
                />
            )}

            {children}
        </button>
    );
}