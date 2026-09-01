import { Routes, Route } from "react-router-dom";

import LandingPage from "../../pages/LandingPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import VerifyEmailPage from "../../pages/VerifyEmailPage";

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/verify-email"
                element={<VerifyEmailPage />}
            />
        </Routes>
    );
}