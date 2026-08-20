import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Checking API...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage("Backend connection failed");
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="rounded-xl bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold">
          EDUCATE
        </h1>

        <p className="mt-4 text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}

export default App;