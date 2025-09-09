// src/pages/Transactions.jsx
import { useState } from "react";
import { useCurrency } from "../components/CurrencyContext";
import { useAuth } from "../components/AuthContext";
import { useTransactions } from "../components/TransactionContext";

const categories = [
  "Salary",
  "Freelance",
  "Food",
  "Travel",
  "Coffee",
  "Deposit",
  "Drink",
  "Shopping",
  "Other",
  "Savings",
];

function Transactions() {
  const { symbol } = useCurrency();
  const { user } = useAuth();
  const {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = useTransactions();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: "",
    recurring: false,
  });
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [visibleCount, setVisibleCount] = useState(10);

  // User-specific transactions
  const userTransactions = transactions.filter((t) => t.userId === user?.id);

  // Filter + Sort
  const filtered = userTransactions
    .filter((t) => (filterType === "all" ? true : t.type === filterType))
    .filter((t) => (filterCategory === "all" ? true : t.category === filterCategory))
    .filter(
      (t) =>
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => {
      if (!dateRange.from || !dateRange.to) return true;
      const d = new Date(t.date);
      return d >= new Date(dateRange.from) && d <= new Date(dateRange.to);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dateAsc":
          return new Date(a.date) - new Date(b.date);
        case "dateDesc":
          return new Date(b.date) - new Date(a.date);
        case "amountAsc":
          return a.amount - b.amount;
        case "amountDesc":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  const visibleTransactions = filtered.slice(0, visibleCount);

  // Totals
  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const netSavings = totalIncome - totalExpense;

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      return alert("Please fill all fields");
    }
    if (!user) return alert("User not logged in");

    if (editingId) {
      editTransaction(editingId, { ...form, userId: user.id });
    } else {
      addTransaction({ ...form, userId: user.id });
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ type: "expense", category: "", amount: "", date: "", recurring: false });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (t) => {
    setForm({ ...t });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteTransaction(id));
    setSelectedIds([]);
  };

  const gradientClasses = {
    green: "bg-gradient-to-r from-green-400 via-green-300 to-green-500 animate-gradient-x",
    red: "bg-gradient-to-r from-red-400 via-red-300 to-red-500 animate-gradient-x",
    blue: "bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 animate-gradient-x",
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-64"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="dateDesc">Newest First</option>
            <option value="dateAsc">Oldest First</option>
            <option value="amountDesc">Highest Amount</option>
            <option value="amountAsc">Lowest Amount</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Transaction
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Income", value: totalIncome, color: "green" },
          { label: "Expenses", value: totalExpense, color: "red" },
          { label: "Net Savings", value: netSavings, color: "blue" },
        ].map((card) => (
          <div
            key={card.label}
            className={`p-4 rounded-xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${gradientClasses[card.color]}`}
          >
            <h3 className="text-white font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              {symbol}
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Transactions Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2"></th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Recurring</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(t.id)}
                    onChange={(e) =>
                      setSelectedIds((prev) =>
                        e.target.checked ? [...prev, t.id] : prev.filter((id) => id !== t.id)
                      )
                    }
                  />
                </td>
                <td className="border p-2">{t.date}</td>
                <td className="border p-2">{t.category}</td>
                <td className="border p-2 capitalize">{t.type}</td>
                <td className="border p-2">
                  {symbol}
                  {t.amount}
                </td>
                <td className="border p-2">{t.recurring ? "Yes" : "No"}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleCount < filtered.length && (
          <div className="text-center mt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {visibleTransactions.map((t) => (
          <div key={t.id} className="p-4 border rounded shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{t.category}</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  t.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {t.type}
              </span>
            </div>
            <p className="text-gray-600">{t.date}</p>
            <p className="font-bold">
              {symbol}
              {t.amount}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(t)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-end z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Transaction" : "Add Transaction"}
            </h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.recurring}
                  onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
                />
                Recurring
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
