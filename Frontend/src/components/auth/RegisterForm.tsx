import { useState } from "react";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User
} from "lucide-react";

import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/apiError";


export default function RegisterForm() {

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const [formData, setFormData] = useState({

        firstName: "",

        lastName: "",

        email: "",

        password: "",

        confirmPassword: ""

    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match"
            );

            return;

        }


        try {

            setIsLoading(true);


            const response =
                await authService.register({

                    firstName:
                        formData.firstName,

                    lastName:
                        formData.lastName,

                    email:
                        formData.email,

                    password:
                        formData.password

                });


            console.log(
                "Registration successful:",
                response
            );


        }catch (error: unknown) {

    setError(
        getApiErrorMessage(error)
    );

} finally {

            setIsLoading(false);

        }

    };


    return (

        <div className="
            bg-[#1E293B]/90
            border
            border-slate-700/70
            rounded-2xl
            p-6
            sm:p-8
            shadow-2xl
            backdrop-blur-sm
        ">


            {/* Heading */}

            <div className="mb-6">

                <h2 className="
                    text-xl
                    sm:text-2xl
                    font-bold
                    text-white
                    tracking-tight
                ">
                    Create your account
                </h2>


                <p className="
                    text-xs
                    text-slate-400
                    mt-1
                ">
                    Join thousands of learners
                </p>

            </div>



            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >


                {/* First Name */}

                <div>

                    <label className="
                        block
                        text-xs
                        font-semibold
                        text-slate-300
                        mb-1.5
                    ">
                        First Name
                    </label>


                    <div className="
                        relative
                        flex
                        items-center
                    ">

                        <User className="
                            w-4
                            h-4
                            text-slate-400
                            absolute
                            left-3.5
                            pointer-events-none
                        " />


                        <input
                            type="text"
                            name="firstName"
                            required
                            value={
                                formData.firstName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="John"
                            className="
                                w-full
                                bg-[#0F172A]/80
                                border
                                border-slate-700
                                rounded-lg
                                pl-10
                                pr-3.5
                                py-2.5
                                text-xs
                                text-white
                                placeholder:text-slate-500
                                focus:outline-none
                                focus:border-indigo-500
                                focus:ring-1
                                focus:ring-indigo-500
                                transition-colors
                            "
                        />

                    </div>

                </div>



                {/* Last Name */}

                <div>

                    <label className="
                        block
                        text-xs
                        font-semibold
                        text-slate-300
                        mb-1.5
                    ">
                        Last Name
                    </label>


                    <div className="
                        relative
                        flex
                        items-center
                    ">

                        <User className="
                            w-4
                            h-4
                            text-slate-400
                            absolute
                            left-3.5
                            pointer-events-none
                        " />


                        <input
                            type="text"
                            name="lastName"
                            required
                            value={
                                formData.lastName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Doe"
                            className="
                                w-full
                                bg-[#0F172A]/80
                                border
                                border-slate-700
                                rounded-lg
                                pl-10
                                pr-3.5
                                py-2.5
                                text-xs
                                text-white
                                placeholder:text-slate-500
                                focus:outline-none
                                focus:border-indigo-500
                                focus:ring-1
                                focus:ring-indigo-500
                                transition-colors
                            "
                        />

                    </div>

                </div>



                {/* Email */}

                <div>

                    <label className="
                        block
                        text-xs
                        font-semibold
                        text-slate-300
                        mb-1.5
                    ">
                        Email
                    </label>


                    <div className="
                        relative
                        flex
                        items-center
                    ">

                        <Mail className="
                            w-4
                            h-4
                            text-slate-400
                            absolute
                            left-3.5
                            pointer-events-none
                        " />


                        <input
                            type="email"
                            name="email"
                            required
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="name@example.com"
                            className="
                                w-full
                                bg-[#0F172A]/80
                                border
                                border-slate-700
                                rounded-lg
                                pl-10
                                pr-3.5
                                py-2.5
                                text-xs
                                text-white
                                placeholder:text-slate-500
                                focus:outline-none
                                focus:border-indigo-500
                                focus:ring-1
                                focus:ring-indigo-500
                                transition-colors
                            "
                        />

                    </div>

                </div>



                {/* Password */}

                <div>

                    <label className="
                        block
                        text-xs
                        font-semibold
                        text-slate-300
                        mb-1.5
                    ">
                        Password
                    </label>


                    <div className="
                        relative
                        flex
                        items-center
                    ">

                        <Lock className="
                            w-4
                            h-4
                            text-slate-400
                            absolute
                            left-3.5
                            pointer-events-none
                        " />


                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            required
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="••••••••"
                            className="
                                w-full
                                bg-[#0F172A]/80
                                border
                                border-slate-700
                                rounded-lg
                                pl-10
                                pr-10
                                py-2.5
                                text-xs
                                text-white
                                placeholder:text-slate-500
                                focus:outline-none
                                focus:border-indigo-500
                                focus:ring-1
                                focus:ring-indigo-500
                                transition-colors
                            "
                        />


                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            className="
                                absolute
                                right-3.5
                                text-slate-400
                                hover:text-slate-200
                                transition-colors
                                focus:outline-none
                            "
                        >

                            {showPassword
                                ? (
                                    <EyeOff className="
                                        w-4
                                        h-4
                                    " />
                                )
                                : (
                                    <Eye className="
                                        w-4
                                        h-4
                                    " />
                                )}

                        </button>

                    </div>

                </div>



                {/* Confirm Password */}

                <div>

                    <label className="
                        block
                        text-xs
                        font-semibold
                        text-slate-300
                        mb-1.5
                    ">
                        Confirm Password
                    </label>


                    <div className="
                        relative
                        flex
                        items-center
                    ">

                        <Lock className="
                            w-4
                            h-4
                            text-slate-400
                            absolute
                            left-3.5
                            pointer-events-none
                        " />


                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            required
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="••••••••"
                            className="
                                w-full
                                bg-[#0F172A]/80
                                border
                                border-slate-700
                                rounded-lg
                                pl-10
                                pr-10
                                py-2.5
                                text-xs
                                text-white
                                placeholder:text-slate-500
                                focus:outline-none
                                focus:border-indigo-500
                                focus:ring-1
                                focus:ring-indigo-500
                                transition-colors
                            "
                        />


                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            className="
                                absolute
                                right-3.5
                                text-slate-400
                                hover:text-slate-200
                                transition-colors
                                focus:outline-none
                            "
                        >

                            {showConfirmPassword
                                ? (
                                    <EyeOff className="
                                        w-4
                                        h-4
                                    " />
                                )
                                : (
                                    <Eye className="
                                        w-4
                                        h-4
                                    " />
                                )}

                        </button>

                    </div>

                </div>



                {/* Error Message */}

                {error && (

                    <div className="
                        rounded-lg
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-3
                        py-2
                        text-xs
                        text-red-400
                    ">

                        {error}

                    </div>

                )}



                {/* Submit Button */}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="
                        w-full
                        mt-2
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        hover:from-blue-500
                        hover:to-indigo-500
                        text-white
                        font-semibold
                        py-2.5
                        px-4
                        rounded-lg
                        text-xs
                        transition-all
                        shadow-md
                        shadow-indigo-600/25
                        cursor-pointer
                        active:scale-[0.99]
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                >

                    {isLoading
                        ? "Creating Account..."
                        : "Create Account"}

                </button>


            </form>


            {/* Login Link */}

            <p className="
                mt-5
                text-center
                text-xs
                text-slate-400
            ">

                Already have an account?{" "}

                <a
                    href="/login"
                    className="
                        text-indigo-400
                        hover:text-indigo-300
                        font-medium
                        underline
                        underline-offset-2
                        transition-colors
                    "
                >

                    Login

                </a>

            </p>


        </div>

    );

}