import React from "react";


interface ErrorBoundaryProps {

    children: React.ReactNode;

}


interface ErrorBoundaryState {

    hasError: boolean;

}


export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {

    public state: ErrorBoundaryState = {

        hasError: false

    };


    public static getDerivedStateFromError():

        ErrorBoundaryState {

        return {

            hasError: true

        };

    }


    public componentDidCatch(
        error: Error,
        errorInfo: React.ErrorInfo
    ) {

        console.error(
            "Application Error:",
            error,
            errorInfo
        );

    }


    public render() {

        if (this.state.hasError) {

            return (

                <div className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-slate-950
                    px-6
                ">

                    <div className="
                        max-w-md
                        text-center
                    ">

                        <h1 className="
                            text-2xl
                            font-bold
                            text-white
                        ">
                            Something went wrong
                        </h1>


                        <p className="
                            mt-3
                            text-sm
                            text-slate-400
                        ">
                            An unexpected error occurred.
                            Please try again.
                        </p>


                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                            className="
                                mt-6
                                rounded-lg
                                bg-indigo-600
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                hover:bg-indigo-500
                            "
                        >
                            Reload Application
                        </button>

                    </div>

                </div>

            );

        }


        return this.props.children;

    }

}