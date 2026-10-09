import { Eye } from "lucide-react";

import type { Category } from "../../../types/category";

import { StatusBadge } from "../../common/ui/StatusBadge";

interface CategoryTableProps {
  categories: Category[];

  onView?: (category: Category) => void;
}

export function CategoryTable({ categories, onView }: CategoryTableProps) {
  return (
    <div
      className="
                overflow-hidden
                rounded-xl
                border
                border-slate-800
                bg-slate-900
            "
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="
                                border-b
                                border-slate-800
                                bg-slate-950
                            "
            >
              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Category Name
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Description
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Created
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.categoryId}
                className="
                                    border-b
                                    border-slate-800
                                    last:border-0
                                    hover:bg-slate-800/40
                                "
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-md
                                                bg-blue-500/10
                                                text-blue-400
                                            "
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </div>

                    <span
                      className="
                                                text-sm
                                                font-medium
                                                text-white
                                            "
                    >
                      {category.name}
                    </span>
                  </div>
                </td>

                <td
                  className="
                                        max-w-xs
                                        px-5
                                        py-4
                                        text-sm
                                        text-slate-400
                                    "
                >
                  <span className="line-clamp-2">
                    {category.description || "No description"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={category.status} />
                </td>

                <td
                  className="
                                        whitespace-nowrap
                                        px-5
                                        py-4
                                        text-sm
                                        text-slate-400
                                    "
                >
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(category)}
                        className="
                                                    rounded-md
                                                    p-2
                                                    text-slate-400
                                                    transition
                                                    hover:bg-slate-800
                                                    hover:text-white
                                                "
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
