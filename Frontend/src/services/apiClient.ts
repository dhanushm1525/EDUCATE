import axios from "axios";


export const apiClient = axios.create({

    baseURL:
        import.meta.env.VITE_API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    },

    withCredentials: true

});


apiClient.interceptors.response.use(

    (response) => {

        return response;

    },


    (error) => {

        if (error.response?.status === 401) {

            console.error(
                "Unauthorized request"
            );

        }


        return Promise.reject(error);

    }

);