import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import api from "../api/axios"; // Adjust path if necessary
import { toast } from "react-toastify";

interface Account {
  id: string;
  balance: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  accounts: Account[];
}

interface AccountDetails {
  id: number;
  userId: number;
  balance: number;
  user: {
    username: string;
  };
}

interface Transaction {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  type: "TRANSFER" | "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  status: "SUCCESS" | "FAILURE";
  createdAt: string;
}
interface AuthContextProps {
  user: User | null;
  currentAccount: Account | null;
  allAccounts: AccountDetails[];
  switchAccount: (accountId: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => void;
  transfer: (
    recipientId: string,
    amount: number,
    senderAccountId: string
  ) => void;
  addAccount: (initialBalance: number) => Promise<void>;
  transactions: Transaction[];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allAccounts, setAllAccounts] = useState<AccountDetails[]>([]);

  const login = async (username: string, password: string) => {
    try {
      const loginResponse = await api.post("/auth/login", {
        username,
        password,
      });
      const { access_token } = loginResponse.data;

      localStorage.setItem("token", access_token);

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
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        accounts: userData.accounts,
      });

      if (userData.accounts && userData.accounts.length > 0) {
        setCurrentAccount(userData.accounts[0]);
      } else {
        setCurrentAccount(null);
      }

      await fetchAllAccounts();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCurrentAccount(null);
    setAllAccounts([]);
  };

  const switchAccount = (accountId: string) => {
    if (user) {
      const account = user.accounts.find((acc) => acc.id === accountId);
      if (account) {
        setCurrentAccount(account);
      }
    }
  };

  const addAccount = async (initialBalance: number) => {
    try {
      const response = await api.post(
        "/accounts",
        { initialBalance },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newAccount = response.data;

      if (user) {
        const updatedAccounts = [...user.accounts, newAccount];
        setUser({ ...user, accounts: updatedAccounts });
        setCurrentAccount(newAccount);
      }

      toast.success("Account added successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add account.");
    }
  };

  const deposit = async (amount: number) => {
    if (!currentAccount) {
      toast.error("No account selected.");
      return;
    }

    try {
      const response = await api.post(
        `/transactions/deposit`,
        { amount, accountId: currentAccount.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        const newBalance = response.data.amount + currentAccount.balance;

        if (currentAccount) {
          setCurrentAccount({
            ...currentAccount,
            balance: newBalance,
          });
        }

        // Update the user accounts in the context
        if (user) {
          const updatedAccounts = user.accounts.map((acc) =>
            acc.id === currentAccount.id ? { ...acc, balance: newBalance } : acc
          );
          setUser({ ...user, accounts: updatedAccounts });
        }

        toast.success("Deposit successful!");
        fetchTransactions(currentAccount.id);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Deposit failed.");
    }
  };

  const withdraw = async (amount: number) => {
    try {
      if (currentAccount && currentAccount.balance >= amount) {
        const response = await api.post(
          `/transactions/withdraw`,
          { amount, accountId: currentAccount.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 201) {
          const newBalance = currentAccount.balance - response.data.amount;

          if (currentAccount) {
            setCurrentAccount({
              ...currentAccount,
              balance: newBalance,
            });
          }
          if (user) {
            const updatedAccounts = user.accounts.map((acc) =>
              acc.id === currentAccount.id
                ? { ...acc, balance: newBalance }
                : acc
            );
            setUser({ ...user, accounts: updatedAccounts });
          }

          toast.success("Withdrawal successful!");
          fetchTransactions(currentAccount.id);
        } else {
          console.log(response.data);
          toast.error(response?.data?.message || "Withdrawal failed.");
        }
      } else {
        toast.error("Insufficient balance.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Withdrawal failed.");
    }
  };

  const transfer = async (
    recipientId: string,
    amount: number,
    senderAccountId: string
  ) => {
    if (currentAccount && currentAccount.balance >= amount) {
      try {
        const response = await api.post(
          "/transactions/transfer",
          {
            fromAccountId: senderAccountId,
            toAccountId: Number(recipientId),
            amount: amount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 201) {
          const newBalance = currentAccount.balance - amount;
          setCurrentAccount({ ...currentAccount, balance: newBalance });
          if (user) {
            const updatedAccounts = user.accounts.map((acc) =>
              acc.id === currentAccount.id
                ? { ...acc, balance: newBalance }
                : acc
            );
            setUser({ ...user, accounts: updatedAccounts });
          }
          toast.success("Transfer successful!");
          fetchTransactions(currentAccount.id);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Transfer failed.");
      }
    } else {
      toast.error("Insufficient funds.");
    }
  };

  const fetchTransactions = async (accountId: string) => {
    try {
      const response = await api.get(`/transactions/history/${accountId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTransactions(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch transactions."
      );
    }
  };

  const fetchAllAccounts = async () => {
    try {
      const response = await api.get("/accounts/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAllAccounts(response.data);
    } catch {
      toast.error("Failed to fetch accounts.");
    }
  };

  useEffect(() => {
    if (currentAccount) {
      fetchTransactions(currentAccount.id);
    }
  }, [currentAccount]);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentAccount,
        allAccounts,
        switchAccount,
        login,
        logout,
        deposit,
        withdraw,
        transfer,
        addAccount,
        transactions,
      }}
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
