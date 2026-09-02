import {
    useNavigate
} from "react-router-dom";

import {
    authService
} from "../services/auth.service";

import {
    useAuthStore
} from "../store/authStore";


export function useLogout() {

    const navigate = useNavigate();


    const clearAuth =
        useAuthStore(
            (state) =>
                state.clearAuth
        );


    const logout =
        async () => {

            try {

                /*
                 * Tell backend to revoke
                 * refresh token and clear cookie.
                 */

                await authService.logout();

            } catch (error) {

                /*
                 * Even if the backend request fails,
                 * clear local authentication state.
                 *
                 * The user should still be logged out
                 * from the frontend.
                 */

                console.error(
                    "Logout failed:",
                    error
                );

            } finally {

                /*
                 * Clear Zustand and sessionStorage.
                 */

                clearAuth();


                /*
                 * Redirect to login.
                 */

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

            }

        };


    return {

        logout

    };

}