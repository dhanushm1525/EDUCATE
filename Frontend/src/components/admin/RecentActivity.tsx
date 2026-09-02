const activities = [
  {
    title: "New student registered",

    description: "A new student account was created.",

    time: "2 minutes ago",
  },

  {
    title: "New course submitted",

    description: "A teacher submitted a course for review.",

    time: "1 hour ago",
  },

  {
    title: "Teacher account created",

    description: "A new teacher joined the platform.",

    time: "3 hours ago",
  },

  {
    title: "Course published",

    description: "A new course was published successfully.",

    time: "Yesterday",
  },
];

export default function RecentActivity() {
  return (
    <div
      className="
                bg-[#111827]
                border
                border-slate-800
                rounded-xl
                p-6
            "
    >
      <div
        className="
                    flex
                    items-center
                    justify-between
                    mb-6
                "
      >
        <div>
          <h3
            className="
                            text-lg
                            font-semibold
                            text-white
                        "
          >
            Recent Activity
          </h3>

          <p
            className="
                            text-sm
                            text-slate-400
                            mt-1
                        "
          >
            Latest activity across EDUCATE
          </p>
        </div>
      </div>

      <div
        className="
                    space-y-5
                "
      >
        {activities.map((activity, index) => (
          <div
            key={index}
            className="
                                    flex
                                    items-start
                                    gap-4
                                "
          >
            {/* Indicator */}

            <div
              className="
                                        w-2
                                        h-2
                                        rounded-full
                                        bg-indigo-500
                                        mt-2
                                    "
            />

            <div
              className="
                                        flex-1
                                    "
            >
              <div
                className="
                                            flex
                                            items-center
                                            justify-between
                                        "
              >
                <h4
                  className="
                                                text-sm
                                                font-medium
                                                text-white
                                            "
                >
                  {activity.title}
                </h4>

                <span
                  className="
                                                text-xs
                                                text-slate-500
                                            "
                >
                  {activity.time}
                </span>
              </div>

              <p
                className="
                                            text-sm
                                            text-slate-400
                                            mt-1
                                        "
              >
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
