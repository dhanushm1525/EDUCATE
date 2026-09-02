import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig
} from "axios";

import {
    useAuthStore
} from "../store/authStore";


interface RetryRequestConfig
    extends InternalAxiosRequestConfig {

    _retry?: boolean;

}


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


let isRefreshing = false;


let failedQueue:
    Array<{

        resolve:
            (
                token: string
            ) => void;

        reject:
            (
                error: unknown
            ) => void;

    }> = [];



const processQueue = (

    error: unknown | null,

    token: string | null

) => {

    failedQueue.forEach(
        (request) => {

            if (
                error
            ) {

                request.reject(
                    error
                );

            } else if (
                token
            ) {

                request.resolve(
                    token
                );

            }

        }
    );


    failedQueue = [];

};



apiClient.interceptors.request.use(

    (config) => {

        const accessToken =
            useAuthStore
                .getState()
                .accessToken;


        if (
            accessToken
        ) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;

        }


        return config;

    },


    (error) => {

        return Promise.reject(
            error
        );

    }

);



apiClient.interceptors.response.use(

    (response) => {

        return response;

    },


    async (
        error: AxiosError
    ) => {

        const originalRequest =
            error.config as RetryRequestConfig;


       

        if (
            !error.response
        ) {

            return Promise.reject(
                error
            );

        }


        

        if (
            error.response.status !== 401
        ) {

            return Promise.reject(
                error
            );

        }


       

        if (
            originalRequest._retry
        ) {

            return Promise.reject(
                error
            );

        }



        if (
            isRefreshing
        ) {

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
                    newAccessToken
                ) => {

                    originalRequest
                        .headers
                        .Authorization =
                        `Bearer ${newAccessToken}`;


                    return apiClient(
                        originalRequest
                    );

                }

            );

        }


        originalRequest._retry =
            true;


        isRefreshing =
            true;


        try {

            

            const {
                authService
            } =
                await import(
                    "./auth.service"
                );


            

            const refreshResponse =
                await authService
                    .refreshAccessToken();


            const newAccessToken =
                refreshResponse
                    .data
                    .accessToken;



            useAuthStore
                .getState()
                .setAccessToken(
                    newAccessToken
                );


           

            processQueue(

                null,

                newAccessToken

            );



            originalRequest
                .headers
                .Authorization =
                `Bearer ${newAccessToken}`;


          

            return apiClient(
                originalRequest
            );

        } catch (
            refreshError
        ) {

           

            processQueue(

                refreshError,

                null

            );


         

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