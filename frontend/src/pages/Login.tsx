import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    try {
      setIsLoading(true);
      await login(username, password);
      toast.success("Welcome back! Redirecting to your wallet...");
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-amber-50 via-amber-100 to-amber-200">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-center text-amber-700 mb-4">
            Welcome to Digital Wallet
          </h1>
          <p className="text-amber-500 text-center text-sm mb-8">
            Securely access your account and manage your funds.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-amber-600 font-medium text-xs mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-amber-600 font-medium text-xs mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-amber-600 text-white font-medium rounded hover:bg-amber-700 transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-amber-500">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-amber-700 hover:underline cursor-pointer"
            >
              Sign up now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
