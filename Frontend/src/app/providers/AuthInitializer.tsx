import {
    useEffect
} from "react";

import type {
    ReactNode
} from "react";

import {
    authService
} from "../../services/auth.service";

import {
    useAuthStore
} from "../../store/authStore";


interface AuthInitializerProps {

    children:
        ReactNode;

}


export default function AuthInitializer({

    children

}: AuthInitializerProps) {


    const setAuth =
        useAuthStore(
            (state) =>
                state.setAuth
        );


    const setAccessToken =
        useAuthStore(
            (state) =>
                state.setAccessToken
        );


    const clearAuth =
        useAuthStore(
            (state) =>
                state.clearAuth
        );


    const isInitialized =
        useAuthStore(
            (state) =>
                state.isInitialized
        );


    const setInitialized =
        useAuthStore(
            (state) =>
                state.setInitialized
        );


    useEffect(() => {


        const initializeAuth =
            async () => {


                try {


                    /*
                     * Restore access token
                     * from the browser session.
                     */

                    const storedAccessToken =
                        sessionStorage.getItem(
                            "accessToken"
                        );


                    /*
                     * No access token.
                     *
                     * Try restoring the session
                     * using the refresh cookie.
                     */

                    if (!storedAccessToken) {


                        const refreshResponse =
                            await authService
                                .refreshAccessToken();


                        const newAccessToken =
                            refreshResponse
                                .data
                                .accessToken;


                        setAccessToken(
                            newAccessToken
                        );

                    } else {


                        /*
                         * Restore token into
                         * Zustand.
                         */

                        setAccessToken(
                            storedAccessToken
                        );

                    }


                    /*
                     * Get the authenticated user.
                     *
                     * If access token is expired,
                     * the Axios interceptor will
                     * automatically refresh it.
                     */

                    const userResponse =
                        await authService
                            .getCurrentUser();


                    /*
                     * Get latest token.
                     *
                     * It may have changed after
                     * automatic refresh.
                     */

                    const currentAccessToken =
                        useAuthStore
                            .getState()
                            .accessToken;


                    if (!currentAccessToken) {

                        throw new Error(
                            "Access token not available"
                        );

                    }


                    /*
                     * Restore complete auth state.
                     */

                    setAuth(

                        userResponse.data,

                        currentAccessToken

                    );


                } catch {


                    /*
                     * No valid session.
                     */

                    clearAuth();

                } finally {


                    setInitialized(
                        true
                    );

                }

            };


        initializeAuth();


    }, [

        setAuth,

        setAccessToken,

        clearAuth,

        setInitialized

    ]);


    if (!isInitialized) {

        return (

            <div className="
                min-h-screen
                bg-[#0B1120]
                flex
                items-center
                justify-center
            ">

                <span className="
                    text-sm
                    text-slate-400
                ">

                    Loading...

                </span>

            </div>

        );

    }


    return children;

}