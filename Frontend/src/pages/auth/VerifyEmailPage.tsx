import { useLocation, Navigate } from "react-router-dom";

import { VerifyEmailForm } from "../../components/auth/VerifyEmailForm";

interface VerifyEmailLocationState {
    userId: string;
    email: string;
}

export default function VerifyEmailPage() {

    const location = useLocation();

    const state =
        location.state as
        | VerifyEmailLocationState
        | null;


    if (!state?.userId || !state?.email) {

        return (
            <Navigate
                to="/register"
                replace
            />
        );

    }


    return (

        <VerifyEmailForm
            userId={state.userId}
            email={state.email}
        />

    );

}