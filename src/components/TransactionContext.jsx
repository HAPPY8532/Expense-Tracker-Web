// src/components/TransactionsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    // Initial load from localStorage (runs only once)
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add transaction
  const addTransaction = (t) => {
    const newTransaction = { ...t, id: Date.now().toString() };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  // Edit transaction
  const editTransaction = (id, updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  // Delete single transaction
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Bulk delete transactions
  const deleteTransactions = (ids) => {
    setTransactions((prev) => prev.filter((t) => !ids.includes(t.id)));
  };

  // Clear all transactions
  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem("transactions");
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        deleteTransactions,
        clearTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
