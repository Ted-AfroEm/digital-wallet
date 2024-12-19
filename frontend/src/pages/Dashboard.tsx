import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, deposit, withdraw, transfer } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return <p>Loading...</p>;

  const handleDeposit = () => {
    if (amount > 0) {
      deposit(amount);
      setAmount(0);
    }
  };

  const handleWithdrawal = () => {
    if (amount > 0) {
      withdraw(amount);
      setAmount(0);
    }
  };

  const handleTransfer = () => {
    if (transferAmount > 0 && recipient) {
      transfer(recipient, transferAmount);
      setRecipient("");
      setTransferAmount(0);
    }
  };

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
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <div className="mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter amount"
            />
            <button
              onClick={handleDeposit}
              className="w-full p-2 bg-blue-500 text-white rounded mb-2"
            >
              Deposit
            </button>
            <button
              onClick={handleWithdrawal}
              className="w-full p-2 bg-green-500 text-white rounded"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Fund Transfer</h2>
          <div className="mb-4">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="Recipient Username"
            />
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="w-full p-2 border rounded mb-2"
              placeholder="Amount"
            />
            <button
              onClick={handleTransfer}
              className="w-full p-2 bg-purple-500 text-white rounded"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
