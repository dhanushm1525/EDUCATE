import {
    useAuthStore
} from "../../store/authStore";


export default function StudentDashboardPage() {


    const user =
        useAuthStore(
            (state) =>
                state.user
        );


    return (

        <div className="
            min-h-screen
            bg-[#0B1120]
            text-white
            p-10
        ">

            <h1 className="
                text-3xl
                font-bold
            ">

                Student Dashboard

            </h1>


            <p className="
                mt-3
                text-slate-400
            ">

                Welcome{" "}

                {user?.firstName}

            </p>

        </div>

    );

}