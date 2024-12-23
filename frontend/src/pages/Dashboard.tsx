import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import AccountSelection from "../components/AccountSelection";
import TransactionActions from "../components/TransactionActions";

interface Transaction {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  type: "TRANSFER" | "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  status: "SUCCESS" | "FAILURE";
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, currentAccount, addAccount, transactions, logout } = useAuth();
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

  const columns: TableColumn<Transaction>[] = [
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `$${row.amount.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={
            row.status === "SUCCESS" ? "text-green-500" : "text-red-500"
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Recipient",
      selector: (row) =>
        row.type === "TRANSFER" ? `Account #${row.toAccountId}` : "Self",
      sortable: true,
    },
  ];

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

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Transaction History
          </h2>
          <DataTable
            columns={columns}
            data={transactions}
            pagination
            highlightOnHover
            responsive
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
