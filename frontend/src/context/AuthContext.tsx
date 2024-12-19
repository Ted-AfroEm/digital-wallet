import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
}

interface Transaction {
  id: string;
  date: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  amount: number;
  status: "Success" | "Failure";
  recipient?: string;
}
interface AuthContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  transfer: (recipient: string, amount: number) => void;
  transactions: Transaction[];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deposit = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
      addTransaction({
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
        type: "Deposit",
        amount,
        status: "Success",
      });
    }
  };

  const withdraw = (amount: number) => {
    if (user && user.balance >= amount) {
      setUser({ ...user, balance: user.balance - amount });
      addTransaction({
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
        type: "Withdrawal",
        amount,
        status: "Success",
      });
    } else {
      addTransaction({
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
        type: "Withdrawal",
        amount,
        status: "Failure",
      });
    }
  };

  const transfer = (recipient: string, amount: number) => {
    if (user && user.balance >= amount) {
      setUser({ ...user, balance: user.balance - amount });
      addTransaction({
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
        type: "Transfer",
        amount,
        status: "Success",
        recipient,
      });
    } else {
      addTransaction({
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
        type: "Transfer",
        amount,
        status: "Failure",
        recipient,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, deposit, withdraw, transfer, transactions }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
