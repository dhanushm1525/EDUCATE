import {
    GraduationCap,
    Users,
    TrendingUp,
} from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthFeatures from "../../components/auth/AuthFeatures";
import RegisterForm from "../../components/auth/RegisterForm";


const registerFeatures = [

    {
        title: "100+ Courses",

        description:
            "Deep-dive into comprehensive modules designed by industry veterans to ensure practical mastery.",

        icon: GraduationCap,

        iconColor:
            "text-indigo-400",

        iconBg:
            "bg-indigo-950/60 border border-indigo-800/40",
    },


    {
        title: "Expert Instructors",

        description:
            "Learn directly from senior professionals who bring real-world experience and case studies to your screen.",

        icon: Users,

        iconColor:
            "text-amber-400",

        iconBg:
            "bg-amber-950/40 border border-amber-800/30",
    },


    {
        title: "Career Growth",

        description:
            "Earn industry-recognized certificates that validate your skills and accelerate your professional advancement.",

        icon: TrendingUp,

        iconColor:
            "text-teal-400",

        iconBg:
            "bg-teal-950/50 border border-teal-800/30",
    },

];


function RegisterPage() {

    return (

        <AuthLayout>

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-12
                gap-12
                lg:gap-16
                items-center
                w-full
            ">


                <AuthFeatures

                    title={
                        <>
                            Start Your Learning
                            <br />

                            <span className="text-slate-100">
                                Journey Today
                            </span>
                        </>
                    }

                    description={
                        "Create your account and join thousands of learners building practical skills through high-quality education."
                    }

                    features={
                        registerFeatures
                    }

                />


                <section className="
                    lg:col-span-5
                    flex
                    justify-center
                    lg:justify-end
                ">

                    <div className="w-full max-w-md">

                        <RegisterForm />

                    </div>

                </section>


            </div>

        </AuthLayout>

    );

}


export default RegisterPage;