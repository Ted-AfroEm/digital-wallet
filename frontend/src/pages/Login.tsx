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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="p-10 bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back to Digital Wallet
          </h1>
          <p className="text-gray-600 text-sm">
            Access your wallet securely and manage your transactions.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:underline cursor-pointer"
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
