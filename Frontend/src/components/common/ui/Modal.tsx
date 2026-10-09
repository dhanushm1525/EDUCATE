import {
    useEffect,
    type ReactNode,
} from "react";

import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    onClose: () => void;

    title: string;
    description?: string;

    children: ReactNode;

    width?: "sm" | "md" | "lg";
}

const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

export function Modal({
    open,
    onClose,
    title,
    description,
    children,
    width = "md",
}: ModalProps) {

    useEffect(() => {

        if (!open) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {

            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };

    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/60
                px-4
            "
            onMouseDown={(event) => {

                if (event.target === event.currentTarget) {
                    onClose();
                }

            }}
        >
            <div
                className={`
                    w-full
                    ${widthClasses[width]}
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    shadow-2xl
                `}
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        border-b
                        border-slate-800
                        px-6
                        py-5
                    "
                >
                    <div>
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            {title}
                        </h2>

                        {description && (
                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-slate-400
                            transition
                            hover:text-white
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}