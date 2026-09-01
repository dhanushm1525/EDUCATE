import { Routes, Route } from "react-router-dom";

import LandingPage from "../../pages/auth/LandingPage";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import VerifyEmailPage from "../../pages/auth/VerifyEmailPage";

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