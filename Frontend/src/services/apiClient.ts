import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig
} from "axios";

import {
    useAuthStore
} from "../store/authStore";


export const apiClient =
    axios.create({

        baseURL:
            import.meta.env
                .VITE_API_BASE_URL,

        headers: {

            "Content-Type":
                "application/json"

        },

        withCredentials: true

    });


/*
 * Separate client for refresh requests.
 *
 * This prevents the refresh request itself
 * from triggering the same interceptors.
 */

const refreshClient =
    axios.create({

        baseURL:
            import.meta.env
                .VITE_API_BASE_URL,

        withCredentials: true

    });


/*
 * Track whether a refresh request
 * is currently in progress.
 */

let isRefreshing =
    false;


/*
 * Requests waiting for a new token.
 */

let failedQueue:
    {
        resolve:
            (token: string) => void;

        reject:
            (error: unknown) => void;

    }[] =
    [];


/*
 * Resolve or reject all requests
 * waiting for token refresh.
 */

const processQueue = (

    error:
        unknown,

    token:
        string | null = null

) => {


    failedQueue.forEach(

        (request) => {


            if (error) {

                request.reject(
                    error
                );

            } else if (token) {

                request.resolve(
                    token
                );

            }

        }

    );


    failedQueue =
        [];

};


/*
 * REQUEST INTERCEPTOR
 *
 * Attach access token to every request.
 */

apiClient.interceptors.request.use(

    (
        config:
            InternalAxiosRequestConfig
    ) => {


        const accessToken =
            useAuthStore
                .getState()
                .accessToken;


        if (accessToken) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;

        }


        return config;

    },


    (
        error
    ) => {

        return Promise.reject(
            error
        );

    }

);


/*
 * RESPONSE INTERCEPTOR
 *
 * Refresh the access token when
 * a request returns 401.
 */

apiClient.interceptors.response.use(

    (
        response
    ) => {

        return response;

    },


    async (
        error:
            AxiosError
    ) => {


        const originalRequest =
            error.config as
            InternalAxiosRequestConfig & {

                _retry?:
                    boolean;

            };


        /*
         * Only handle 401 errors.
         */

        if (

            error.response?.status !== 401 ||

            originalRequest._retry

        ) {

            return Promise.reject(
                error
            );

        }


        /*
         * Prevent retrying the same
         * request multiple times.
         */

        originalRequest._retry =
            true;


        /*
         * If refresh is already running,
         * wait for it.
         */

        if (isRefreshing) {

            return new Promise<string>(

                (
                    resolve,
                    reject
                ) => {

                    failedQueue.push({

                        resolve,

                        reject

                    });

                }

            ).then(

                (
                    token
                ) => {


                    originalRequest.headers.Authorization =
                        `Bearer ${token}`;


                    return apiClient(
                        originalRequest
                    );

                }

            ).catch(

                (
                    queueError
                ) => {

                    return Promise.reject(
                        queueError
                    );

                }

            );

        }


        /*
         * Start token refresh.
         */

        isRefreshing =
            true;


        try {


            const refreshResponse =
                await refreshClient.post(
                    "/auth/refresh"
                );


            const newAccessToken =
                refreshResponse
                    .data
                    .data
                    .accessToken;


            /*
             * Update Zustand and
             * sessionStorage.
             */

            useAuthStore
                .getState()
                .setAccessToken(
                    newAccessToken
                );


            /*
             * Process queued requests.
             */

            processQueue(

                null,

                newAccessToken

            );


            /*
             * Retry original request.
             */

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


            return apiClient(
                originalRequest
            );


        } catch (
            refreshError
        ) {


            /*
             * Reject all queued requests.
             */

            processQueue(
                refreshError,
                null
            );


            /*
             * Session is no longer valid.
             */

            useAuthStore
                .getState()
                .clearAuth();


            return Promise.reject(
                refreshError
            );


        } finally {


            isRefreshing =
                false;

        }

    }

);