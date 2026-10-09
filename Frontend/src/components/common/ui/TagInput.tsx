import { useState, type KeyboardEvent } from "react";

import { X } from "lucide-react";

interface TagInputProps {
  label?: string;

  values: string[];

  onChange: (values: string[]) => void;

  placeholder?: string;

  error?: string;
}

export function TagInput({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter",
  error,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addValue = () => {
    const value = input.trim();

    if (!value) {
      return;
    }

    if (values.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setInput("");
      return;
    }

    onChange([...values, value]);

    setInput("");
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      addValue();
    }

    if (event.key === "Backspace" && !input && values.length > 0) {
      removeValue(values.length - 1);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          className="
                        block
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-300
                    "
        >
          {label}
        </label>
      )}

      <div
        className="
                    flex
                    min-h-11
                    flex-wrap
                    items-center
                    gap-2
                    rounded-md
                    border
                    border-slate-700
                    bg-slate-800
                    px-3
                    py-2
                    focus-within:border-blue-500
                "
      >
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                bg-blue-500/10
                                px-2
                                py-1
                                text-xs
                                text-blue-400
                            "
          >
            {value}

            <button
              type="button"
              onClick={() => removeValue(index)}
              className="
                                    text-blue-400
                                    hover:text-white
                                "
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addValue}
          placeholder={values.length === 0 ? placeholder : "Add another"}
          className="
                        min-w-32
                        flex-1
                        bg-transparent
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-slate-500
                    "
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
