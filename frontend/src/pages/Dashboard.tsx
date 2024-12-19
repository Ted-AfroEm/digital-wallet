import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";

interface Transaction {
  date: string;
  type: string;
  amount: number;
  status: string;
  recipient?: string;
}

const Dashboard: React.FC = () => {
  const { user, deposit, withdraw, transfer, transactions } = useAuth();
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [isActionsOpen, setIsActionsOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return <p>Loading...</p>;

  const handleDeposit = () => {
    if (depositAmount > 0) {
      deposit(depositAmount);
      setDepositAmount(0);
    }
  };

  const handleWithdrawal = () => {
    if (withdrawAmount > 0) {
      withdraw(withdrawAmount);
      setWithdrawAmount(0);
    }
  };

  const handleTransfer = () => {
    if (transferAmount > 0 && recipient) {
      transfer(recipient, transferAmount);
      setRecipient("");
      setTransferAmount(0);
    }
  };

  const columns: TableColumn<Transaction>[] = [
    {
      name: "Date",
      selector: (row) => row.date,
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
            row.status === "Success" ? "text-green-500" : "text-red-500"
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Recipient",
      selector: (row) => row.recipient || "N/A",
      sortable: true,
    },
  ];

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Account Balance</h2>
          <p className="text-lg">${user.balance.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Actions</h2>
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="text-blue-500 hover:underline"
            >
              {isActionsOpen ? "Collapse" : "Expand"}
            </button>
          </div>
          {isActionsOpen && (
            <div className="mb-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Deposit Funds</h3>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Enter deposit amount"
                />
                <button
                  onClick={handleDeposit}
                  className="w-full p-2 bg-blue-500 text-white rounded"
                >
                  Deposit
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Withdraw Funds</h3>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Enter withdrawal amount"
                />
                <button
                  onClick={handleWithdrawal}
                  className="w-full p-2 bg-green-500 text-white rounded"
                >
                  Withdraw
                </button>
              </div>
            </div>
          )}
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
      <div className="p-4 bg-gray-100 rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <DataTable
          columns={columns}
          data={transactions}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default Dashboard;
