import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header
      className="
                h-20
                border-b
                border-slate-800
                bg-[#0B1120]
                flex
                items-center
                justify-between
                px-8
            "
    >
      {/* Title */}

      <div>
        <h2
          className="
                        text-xl
                        font-semibold
                        text-white
                    "
        >
          Admin Dashboard
        </h2>

        <p
          className="
                        text-sm
                        text-slate-400
                        mt-1
                    "
        >
          Welcome back, Admin
        </p>
      </div>

      {/* Actions */}

      <div
        className="
                    flex
                    items-center
                    gap-5
                "
      >
        {/* Search */}

        <div
          className="
                        relative
                        hidden
                        md:block
                    "
        >
          <Search
            className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            w-4
                            h-4
                            text-slate-500
                        "
          />

          <input
            placeholder="Search..."
            className="
                            w-56
                            bg-[#111827]
                            border
                            border-slate-700
                            rounded-lg
                            pl-10
                            pr-4
                            py-2
                            text-sm
                            text-white
                            outline-none
                            focus:border-indigo-500
                        "
          />
        </div>

        {/* Notifications */}

        <button
          className="
                        text-slate-400
                        hover:text-white
                        transition
                        cursor-pointer
                    "
        >
          <Bell
            className="
                            w-5
                            h-5
                        "
          />
        </button>

        {/* Admin Profile */}

        <div
          className="
                        flex
                        items-center
                        gap-3
                    "
        >
          <div
            className="
                            w-9
                            h-9
                            rounded-full
                            bg-indigo-600
                            flex
                            items-center
                            justify-center
                            text-sm
                            font-semibold
                            text-white
                        "
          >
            A
          </div>

          <div
            className="
                            hidden
                            md:block
                        "
          >
            <p
              className="
                                text-sm
                                text-white
                            "
            >
              Administrator
            </p>

            <p
              className="
                                text-xs
                                text-slate-400
                            "
            >
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
