import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
}

interface AuthContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  transfer: (recipient: string, amount: number) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  const deposit = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  const withdraw = (amount: number) => {
    if (user && user.balance >= amount) {
      setUser({ ...user, balance: user.balance - amount });
    } else {
      alert("Insufficient balance!");
    }
  };

  const transfer = (recipient: string, amount: number) => {
    if (user && user.balance >= amount) {
      setUser({ ...user, balance: user.balance - amount });
      alert(`Transferred $${amount} to ${recipient}`);
    } else {
      alert("Insufficient balance or invalid recipient!");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, deposit, withdraw, transfer }}
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
