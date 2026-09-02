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
                     * 1.
                     * Get a new access token
                     * using the refresh token cookie.
                     */

                    const refreshResponse =
                        await authService
                            .refreshAccessToken();


                    const accessToken =
                        refreshResponse
                            .data
                            .accessToken;


                    /*
                     * 2.
                     * Store access token temporarily.
                     *
                     * The Axios interceptor will now
                     * attach it to GET /auth/me.
                     */

                    setAccessToken(
                        accessToken
                    );


                    /*
                     * 3.
                     * Get current user.
                     */

                    const userResponse =
                        await authService
                            .getCurrentUser();


                    /*
                     * 4.
                     * Restore complete auth state.
                     */

                    setAuth(

                        userResponse.data,

                        accessToken

                    );

                } catch {

                    /*
                     * No valid session.
                     */

                    clearAuth();

                } finally {

                    /*
                     * Authentication check finished.
                     */

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


    return (

        <>
            {children}
        </>

    );

}