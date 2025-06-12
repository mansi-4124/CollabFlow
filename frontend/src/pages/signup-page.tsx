import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth-form";
import {
  googleSignupService,
  signupUserService,
} from "../services/authService";
import type { CredentialResponse } from "react-oauth-google";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      if (form.password !== form.confirmPassword)
        throw new Error("Passwords does not match");
      setLoading(true);
      await signupUserService(form);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failed", err);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      await googleSignupService(credentialResponse.credential as string);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Signup failed", error);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleFailure = () => {
    console.error("Google Signup failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] dark:bg-[#0f0e47]">
      <AuthForm
        type="signup"
        values={form}
        onChange={handleChange}
        onSubmit={handleSignup}
        loading={loading}
        onGoogleSuccess={onGoogleSuccess}
        onGoogleFailure={onGoogleFailure}
      />
    </div>
  );
}
