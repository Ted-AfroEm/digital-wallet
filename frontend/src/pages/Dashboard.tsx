import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AccountSelection from "../components/AccountSelection";
import TransactionActions from "../components/TransactionActions";
import TransactionHistory from "../components/TransactionHistory";

const Dashboard: React.FC = () => {
  const { user, currentAccount, addAccount, logout } = useAuth();
  const navigate = useNavigate();

  const [initialBalance, setInitialBalance] = useState<number | "">("");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAddAccount = async () => {
    if (typeof initialBalance === "number" && initialBalance > 0) {
      await addAccount(initialBalance);
      setInitialBalance("");
    } else {
      toast.error("Please enter a valid initial balance.");
    }
  };

  if (!user) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }
  if (!currentAccount) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Welcome, {user.username}!
          </h2>
          <p className="mb-4 text-gray-600">
            It looks like you don’t have any accounts yet.
          </p>
          <input
            type="number"
            placeholder="Initial Balance"
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
            className="p-2 border rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddAccount}
            className="w-full p-3 bg-blue-500 font-medium shadow-md hover:bg-blue-600 text-white rounded-lg transition"
          >
            Create First Account
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 pt-10">
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username}!
          </h1>
          <button
            onClick={logout}
            className="p-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        </header>

        <AccountSelection />

        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Current Account Balance
          </h2>
          <p className="text-2xl font-bold text-gray-800">
            ${currentAccount.balance.toFixed(2)}
          </p>
        </div>

        <TransactionActions />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;
