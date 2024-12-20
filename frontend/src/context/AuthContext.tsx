import React, { createContext, useState, useContext, ReactNode } from "react";
import api from "../api/axios"; // Adjust path if necessary

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
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (username: string, password: string) => {
    try {
      // Call login endpoint to get access token
      const loginResponse = await api.post("/auth/login", {
        username,
        password,
      });
      const { access_token } = loginResponse.data;

      // Store the token
      localStorage.setItem("token", access_token);

      // Call /users/me to get user information
      const userResponse = await api.post(
        "/users/me",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const userData = userResponse.data;
      const balance = userData.accounts?.[0]?.balance || 0;

      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        balance,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

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
