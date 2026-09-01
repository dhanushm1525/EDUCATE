import {
    BookOpen,
    UserCheck,
    Rocket,
} from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthFeatures from "../../components/auth/AuthFeatures";
import LoginForm from "../../components/auth/LoginForm";


const loginFeatures = [

    {
        title: "100+ Courses",

        description:
            "Learn modern technologies and professional skills from our curated library.",

        icon: BookOpen,

        iconColor:
            "text-indigo-400",

        iconBg:
            "bg-indigo-950/60 border border-indigo-800/40",
    },


    {
        title: "Expert Instructors",

        description:
            "Learn from experienced educators and industry professionals who practice what they teach.",

        icon: UserCheck,

        iconColor:
            "text-amber-400",

        iconBg:
            "bg-amber-950/40 border border-amber-800/30",
    },


    {
        title: "Career Growth",

        description:
            "Build job-ready skills and earn recognized certificates to accelerate your professional journey.",

        icon: Rocket,

        iconColor:
            "text-teal-400",

        iconBg:
            "bg-teal-950/50 border border-teal-800/30",
    },

];


function LoginPage() {

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


                {/* Left Section */}

                <AuthFeatures

                    title={
                        <>
                            Transform Your Future
                            <br />

                            with{" "}

                            <span className="text-slate-100">
                                Premium Learning
                            </span>
                        </>
                    }

                     description={
        "Join thousands of learners building practical skills through high-quality online education."
    }
                    

                    features={
                        loginFeatures
                    }

                />


                {/* Right Section */}

                <section className="
                    lg:col-span-5
                    flex
                    justify-center
                    lg:justify-end
                ">

                    <LoginForm />

                </section>


            </div>

        </AuthLayout>

    );
}


export default LoginPage;