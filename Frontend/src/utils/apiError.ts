import axios from "axios";

import type { ApiErrorResponse } from "../types/api";


export const getApiErrorMessage = (
    error: unknown
): string => {

    if (axios.isAxiosError(error)) {

        const data =
            error.response?.data as
            ApiErrorResponse | undefined;


        return (
            data?.message ||
            "Something went wrong. Please try again."
        );

    }


    return "An unexpected error occurred.";

};