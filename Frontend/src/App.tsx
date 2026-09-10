import { AppRouter } from "./app/router/AppRouter";

import AuthInitializer from "./app/providers/AuthInitializer";

import ToastProvider from "./components/common/ToastProvider";

function App() {
  return (
    <>
      
      <AuthInitializer>
        <AppRouter />
      </AuthInitializer>
      <ToastProvider />
    </>
  );
}

export default App;
