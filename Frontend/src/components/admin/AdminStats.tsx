import { Users, GraduationCap, BookOpen, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Total Students",

    value: "1,245",

    icon: GraduationCap,

    description: "+12% from last month",
  },

  {
    title: "Total Teachers",

    value: "86",

    icon: Users,

    description: "+5% from last month",
  },

  {
    title: "Total Courses",

    value: "148",

    icon: BookOpen,

    description: "+18% from last month",
  },

  {
    title: "Total Revenue",

    value: "$24,500",

    icon: DollarSign,

    description: "+9% from last month",
  },
];

export default function AdminStats() {
  return (
    <div
      className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-6
            "
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
                                    bg-[#111827]
                                    border
                                    border-slate-800
                                    rounded-xl
                                    p-5
                                "
          >
            <div
              className="
                                        flex
                                        items-center
                                        justify-between
                                    "
            >
              <div>
                <p
                  className="
                                                text-sm
                                                text-slate-400
                                            "
                >
                  {stat.title}
                </p>

                <h3
                  className="
                                                text-2xl
                                                font-bold
                                                text-white
                                                mt-2
                                            "
                >
                  {stat.value}
                </h3>
              </div>

              <div
                className="
                                            w-11
                                            h-11
                                            rounded-lg
                                            bg-indigo-500/10
                                            flex
                                            items-center
                                            justify-center
                                        "
              >
                <Icon
                  className="
                                                w-5
                                                h-5
                                                text-indigo-400
                                            "
                />
              </div>
            </div>

            <p
              className="
                                        text-xs
                                        text-emerald-400
                                        mt-4
                                    "
            >
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
