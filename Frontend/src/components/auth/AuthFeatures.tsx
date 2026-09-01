import type { LucideIcon } from "lucide-react";

interface FeatureCard {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
}

interface AuthFeaturesProps {
    title: React.ReactNode;
    description: string;
    features: FeatureCard[];
}

function AuthFeatures({
    title,
    description,
    features,
}: AuthFeaturesProps) {
    return (
        <section className="lg:col-span-7 flex flex-col justify-center">

            <h1 className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-extrabold
                text-white
                tracking-tight
                leading-[1.15]
            ">
                {title}
            </h1>

            <p className="
                mt-4
                text-sm
                sm:text-base
                text-slate-400
                max-w-xl
                leading-relaxed
            ">
                {description}
            </p>


            <div className="
                mt-8
                space-y-4
                max-w-xl
            ">

                {features.map((item) => {

                    const IconComponent = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="
                                bg-[#1E293B]/70
                                border
                                border-slate-700/60
                                rounded-xl
                                p-4
                                sm:p-5
                                flex
                                items-start
                                gap-4
                                transition-colors
                                hover:border-slate-600
                            "
                        >

                            <div
                                className={`
                                    w-10
                                    h-10
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                    mt-0.5

                                    ${
                                        item.iconBg ??
                                        "bg-indigo-950/60 border border-indigo-800/40"
                                    }

                                    ${
                                        item.iconColor ??
                                        "text-indigo-400"
                                    }
                                `}
                            >

                                <IconComponent
                                    className="w-5 h-5"
                                />

                            </div>


                            <div>

                                <h3 className="
                                    text-sm
                                    font-bold
                                    text-slate-100
                                ">
                                    {item.title}
                                </h3>


                                <p className="
                                    text-xs
                                    text-slate-400
                                    mt-1
                                    leading-relaxed
                                ">
                                    {item.description}
                                </p>

                            </div>

                        </div>
                    );
                })}

            </div>

        </section>
    );
}

export default AuthFeatures;