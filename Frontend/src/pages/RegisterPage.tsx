import AuthLogo from "../components/auth/AuthLogo";
import RegisterFeatures from "../components/auth/RegisterFeatures";
import RegisterForm from "../components/auth/RegisterForm";
import AuthFooter from "../components/auth/AuthFooter";


function RegisterPage() {
    return (
        <div className="
            min-h-screen
            bg-[#0F172A]
            text-slate-100
            flex
            flex-col
            justify-between
            font-sans
            antialiased
            selection:bg-indigo-600
            selection:text-white
        ">

            <main className="
                flex-1
                max-w-7xl
                w-full
                mx-auto
                px-6
                lg:px-12
                py-12
                lg:py-16
                flex
                flex-col
                justify-center
            ">

                {/* Mobile / Tablet Logo */}
                <div className="lg:hidden mb-10">
                    <AuthLogo />
                </div>


                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-12
                    gap-12
                    lg:gap-16
                    items-start
                ">

                    {/* Left Side */}
                    <RegisterFeatures />


                    {/* Right Side */}
                    <section className="
                        lg:col-span-5
                        flex
                        flex-col
                    ">

                        {/* Desktop Logo */}
                        <div className="hidden lg:flex mb-6">
                            <AuthLogo size="sm" />
                        </div>


                        <RegisterForm />

                    </section>

                </div>

            </main>


            <AuthFooter />

        </div>
    );
}


export default RegisterPage;