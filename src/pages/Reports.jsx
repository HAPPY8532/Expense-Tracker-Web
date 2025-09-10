import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrency } from "../components/CurrencyContext";
import { useAuth } from "../components/AuthContext";
import { useTransactions } from "../components/TransactionContext";
import { useEffect, useState } from "react";

const categoriesList = [
  "All",
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

function Reports() {
  const { symbol, setCurrency } = useCurrency();
  const { user } = useAuth();
  const { transactions } = useTransactions();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Sync user’s currency
  useEffect(() => {
    if (user?.currency) setCurrency(user.currency);
  }, [user, setCurrency]);

  if (!user)
    return <p className="text-center text-gray-500">Please log in to view reports.</p>;

  // Filter by category & date
  const filteredTransactions = transactions.filter((t) => {
    const inCategory = categoryFilter === "All" || t.category === categoryFilter;
    const inDate =
      (!dateRange.from || new Date(t.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(t.date) <= new Date(dateRange.to));
    return inCategory && inDate;
  });

  // Totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netSavings = totalIncome - totalExpense;

  // Pie chart: Income vs Expense
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];
  const pieColors = ["#22c55e", "#ef4444"];

  // Category-wise expenses
  const categoryData = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const existing = acc.find((c) => c.name === t.category);
      if (existing) existing.value += Number(t.amount);
      else acc.push({ name: t.category, value: Number(t.amount) });
      return acc;
    }, []);
  const categoryColors = [
    "#3b82f6",
    "#f59e0b",
    "#10b981",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#6366f1",
    "#eab308",
    "#14b8a6",
  ];

  // Monthly summary
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = monthNames.map((month, i) => {
    const monthTransactions = filteredTransactions.filter(
      (t) => new Date(t.date).getMonth() === i
    );
    const incomeMonth = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenseMonth = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { month, Income: incomeMonth, Expense: expenseMonth };
  });

  // Summary cards
  const summaryCards = [
    { label: "Total Income", value: totalIncome, color: "green" },
    { label: "Total Expense", value: totalExpense, color: "red" },
    { label: "Net Savings", value: netSavings, color: "blue" },
  ];
  const gradientClasses = {
    green: "bg-gradient-to-r from-green-400 via-green-300 to-green-500 animate-gradient-x",
    red: "bg-gradient-to-r from-red-400 via-red-300 to-red-500 animate-gradient-x",
    blue: "bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 animate-gradient-x",
  };

  const formatAmount = (num) => num.toLocaleString();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`p-6 rounded-2xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${gradientClasses[card.color]}`}
          >
            <h3 className="text-white text-lg font-medium">{card.label}</h3>
            <p className="text-3xl font-bold text-white drop-shadow-lg animate-pulse">
              {symbol}{formatAmount(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col space-y-2">
          <label className="font-medium">From:</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">To:</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Pie: Income vs Expense */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-2xl transition-all duration-500">
          <h3 className="text-lg font-bold mb-2">Income vs Expense (Pie)</h3>
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-500 italic">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ value }) => `${symbol}${formatAmount(value)}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${symbol}${formatAmount(value)}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar: Income vs Expense */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-2xl transition-all duration-500">
          <h3 className="text-lg font-bold mb-2">Income vs Expense (Bar)</h3>
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-500 italic">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: "Total", Income: totalIncome, Expense: totalExpense }]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${symbol}${formatAmount(value)}`} />
                <Legend />
                <Bar dataKey="Income" fill="#22c55e" />
                <Bar dataKey="Expense" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category-wise Expense */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-2xl transition-all duration-500">
          <h3 className="text-lg font-bold mb-2">Category-wise Expenses</h3>
          {categoryData.length === 0 ? (
            <p className="text-center text-gray-500 italic">No expense data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  label={({ value }) => `${symbol}${formatAmount(value)}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${symbol}${formatAmount(value)}`} />
                <Legend verticalAlign="bottom" height={66} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Income & Expenses */}
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-2xl transition-all duration-500">
        <h3 className="text-lg font-bold mb-2">Monthly Income & Expenses</h3>
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 italic">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${symbol}${formatAmount(value)}`} />
              <Legend />
              <Bar dataKey="Income" fill="#22c55e" />
              <Bar dataKey="Expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Reports;
