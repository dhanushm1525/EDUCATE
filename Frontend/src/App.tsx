import {
    AppRouter
} from "./app/router/AppRouter";

import AuthInitializer from "./app/providers/AuthInitializer";


function App() {

    return (

        <AuthInitializer>

            <AppRouter />

        </AuthInitializer>

    );

}


export default App;