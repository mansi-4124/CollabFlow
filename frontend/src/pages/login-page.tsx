import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth-form";
import { googleLoginService, loginUserService } from "../services/authService";
import type { CredentialResponse } from "react-oauth-google";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await loginUserService(form);
      dispatch(setUser(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      await googleLoginService(credentialResponse.credential as string);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleFailure = () => {
    console.error("Google Login failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] dark:bg-[#0f0e47]">
      <AuthForm
        type="login"
        values={form}
        onChange={handleChange}
        onSubmit={handleLogin}
        loading={loading}
        onGoogleSuccess={onGoogleSuccess}
        onGoogleFailure={onGoogleFailure}
      />
    </div>
  );
}
