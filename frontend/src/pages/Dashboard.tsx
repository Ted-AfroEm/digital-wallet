import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import api from "../api/axios";

interface Transaction {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  type: "TRANSFER" | "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  status: "SUCCESS" | "FAILURE";
  createdAt: string;
}
interface AccountDetails {
  id: number;
  userId: number;
  balance: number;
  user: {
    username: string;
  };
}

const Dashboard: React.FC = () => {
  const {
    user,
    currentAccount,
    switchAccount,
    deposit,
    withdraw,
    transfer,
    addAccount,
    transactions,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [allAccounts, setAllAccounts] = useState<AccountDetails[]>([]);

  const [initialBalance, setInitialBalance] = useState<number | "">("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/accounts/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAllAccounts(response.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch accounts.");
      }
    };
    fetchAccounts();
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || !currentAccount) return <p>Loading...</p>;

  const handleDeposit = async () => {
    if (depositAmount > 0) {
      await deposit(depositAmount);
      setDepositAmount(0);
    } else {
      toast.error("Enter a valid deposit amount.");
    }
  };

  const handleWithdrawal = () => {
    if (withdrawAmount > 0) {
      withdraw(withdrawAmount);
      setWithdrawAmount(0);
    } else {
      toast.error("Enter a valid withdrawal amount.");
    }
  };

  const handleTransfer = async () => {
    if (transferAmount > 0 && recipient) {
      transfer(recipient, transferAmount, currentAccount.id);
      setRecipient("");
      setTransferAmount(0);
    } else {
      toast.error("Enter valid transfer details.");
    }
  };

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
      selector: (row) => new Date(row.createdAt).toLocaleString(), // Format date
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

  if (!user || !currentAccount) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 pt-10">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
          <button
            onClick={logout}
            className="p-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        </header>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Select Account</h2>
          <div className="flex flex-wrap gap-2 mt-2 justify-between">
            <div className="flex items-center gap-2 mt-4">
              {user.accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => switchAccount(account.id)}
                  className={`p-2 rounded ${
                    account.id === currentAccount.id
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Account #{account.id}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="number"
                placeholder="Initial Balance"
                className="p-2 border rounded"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
              />
              <button
                onClick={handleAddAccount}
                className="p-2 bg-green-500 text-white rounded"
              >
                + Add Account
              </button>
            </div>
          </div>
        </div>{" "}
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Current Account Balance</h2>
          <p className="text-lg">${currentAccount.balance.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-4">
          {/* Deposit Section */}
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Deposit</h2>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter deposit amount"
            />
            <button
              onClick={handleDeposit}
              className="w-full mt-2 p-2 bg-gray-500 text-white rounded"
            >
              Deposit
            </button>
          </div>

          {/* Withdraw Section */}
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Withdraw</h2>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter withdrawal amount"
            />
            <button
              onClick={handleWithdrawal}
              className="w-full mt-2 p-2 bg-gray-500 text-white rounded"
            >
              Withdraw
            </button>
          </div>

          {/* Transfer Section */}
          <div className="p-4 bg-gray-100 rounded shadow md:col-span-2 ">
            <h2 className="text-xl font-bold mb-4">Transfer</h2>
            <div className="flex flex-col lg:flex-row gap-4">
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full lg:w-1/2 p-2 border rounded"
              >
                <option value="" disabled>
                  Select Recipient
                </option>
                {allAccounts
                  .filter(
                    (account) => account.id !== Number(currentAccount?.id)
                  )
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
                className="w-full lg:w-1/2 p-2 border rounded"
                placeholder="Amount"
              />
            </div>
            <button
              onClick={handleTransfer}
              className="w-full mt-4 p-2 bg-gray-500 text-white rounded"
            >
              Transfer
            </button>
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
    </div>
  );
};

export default Dashboard;
