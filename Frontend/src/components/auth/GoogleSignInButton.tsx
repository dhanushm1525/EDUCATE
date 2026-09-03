import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";
import { getRoleDashboardPath } from "../../utils/getRoleDashboardPath";
import { getApiErrorMessage } from "../../utils/apiError";

export default function GoogleSignInButton() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      setError(null);

      const credential = credentialResponse.credential;

      if (!credential) {
        throw new Error("Google credential not received");
      }

      const response = await authService.googleSignIn({
        credential,
      });

      const { user, accessToken } = response.data;

      setAuth(user, accessToken);

      navigate(getRoleDashboardPath(user.role), {
        replace: true,
      });
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          setError("Google sign-in failed");
        }}
        // theme="filled_black"
        // shape="rectangular"
        // width="400"


    text="continue_with"
      />

      {error && (
        <p className="mt-3 text-center text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}