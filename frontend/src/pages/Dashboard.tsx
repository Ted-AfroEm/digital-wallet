import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Account Balance</h2>
          <p className="text-lg">${user.balance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
