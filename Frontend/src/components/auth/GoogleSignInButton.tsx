import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";
import { getRoleDashboardPath } from "../../utils/getRoleDashboardPath";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";

export default function GoogleSignInButton() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useToastStore((state) => state.addToast);

  const handleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
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
      addToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          addToast("Google sign-in failed", "error");
        }}
        // theme="filled_black"
        // shape="rectangular"
        // width="400"


    text="continue_with"
      />

    </div>
  );
}