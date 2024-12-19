import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock user data
    const mockUser = {
      id: "1",
      username: "testuser",
      email: "testuser@example.com",
      balance: 100.0,
    };

    // Simulate login
    login(mockUser);

    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
          />
          <button className="w-full p-2 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
