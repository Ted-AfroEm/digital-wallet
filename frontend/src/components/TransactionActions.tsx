import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const TransactionActions: React.FC = () => {
  const { currentAccount, deposit, withdraw, transfer, allAccounts } =
    useAuth();

  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);

  const handleDeposit = () => {
    if (depositAmount > 0) {
      deposit(depositAmount);
      setDepositAmount(0);
    } else {
      alert("Enter a valid deposit amount.");
    }
  };

  const handleWithdrawal = () => {
    if (withdrawAmount > 0) {
      withdraw(withdrawAmount);
      setWithdrawAmount(0);
    } else {
      alert("Enter a valid withdrawal amount.");
    }
  };

  const handleTransfer = () => {
    if (transferAmount > 0 && recipient) {
      transfer(recipient, transferAmount, currentAccount!.id);
      setRecipient("");
      setTransferAmount(0);
    } else {
      alert("Enter valid transfer details.");
    }
  };

  if (!currentAccount) {
    return <p className="text-center text-gray-600">No account selected.</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Deposit</h2>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(Number(e.target.value))}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter deposit amount"
        />
        <button
          onClick={handleDeposit}
          className="w-full p-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          Deposit
        </button>
      </div>
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Withdraw</h2>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(Number(e.target.value))}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter withdrawal amount"
        />
        <button
          onClick={handleWithdrawal}
          className="w-full p-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          Withdraw
        </button>
      </div>
      <div className="p-6 bg-gray-100 rounded-lg shadow-md lg:col-span-2">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Transfer</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full lg:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Select Recipient
            </option>
            {allAccounts
              .filter((account) => account.id !== Number(currentAccount!.id))
              .map((account) => (
                <option key={account.id} value={account.id}>
                  {account.user.username} - Account #{account.id}
                </option>
              ))}
          </select>
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            className="w-full lg:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Amount"
          />
        </div>
        <button
          onClick={handleTransfer}
          className="w-full mt-4 p-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          Transfer
        </button>
      </div>
    </div>
  );
};

export default TransactionActions;
