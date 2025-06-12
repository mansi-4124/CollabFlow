import { GoogleLogin, type CredentialResponse } from "react-oauth-google";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";

type Props = {
  type: "login" | "signup";
  values: {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
  onGoogleFailure?: () => void;
  loading: boolean;
};

export default function AuthForm({
  type,
  values,
  onChange,
  onSubmit,
  onGoogleSuccess,
  onGoogleFailure,
  loading,
}: Props) {
  const isSignup = type === "signup";

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#1e1e3f] shadow-lg p-8 rounded-md">
      <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-6">
        {type === "login" ? "Login to CollabFlow" : "Sign up for CollabFlow"}
      </h2>

      <div className="space-y-4">
        {isSignup && (
          <Input
            name="name"
            placeholder="Full Name"
            value={values.name}
            onChange={onChange}
            className="rounded-sm"
          />
        )}
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={onChange}
          className="rounded-sm"
          autoComplete="new-email"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={onChange}
          className="rounded-sm"
          autoComplete="new-password"
        />
        {isSignup && (
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={onChange}
            className="rounded-sm"
            autoComplete="new-password"
          />
        )}

        <Button
          className="w-full mt-2 rounded-sm"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading
            ? isSignup
              ? "Signing up..."
              : "Logging in..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </Button>
        <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleFailure} />
        <div className="text-center text-sm text-muted-foreground mt-4">
          {type === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Create account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
