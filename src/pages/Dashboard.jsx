import { useEffect, useState } from "react";
import { useCurrency } from "../components/CurrencyContext";
import { useAuth } from "../components/AuthContext";
import { useTransactions } from "../components/TransactionContext";

function Dashboard() {
  const { symbol, setCurrency } = useCurrency();
  const { user, setUser } = useAuth();
  const { transactions, addTransaction } = useTransactions();

  const [selectedProfile, setSelectedProfile] = useState("normal");
  const [budgets, setBudgets] = useState({});
  const [customBudget, setCustomBudget] = useState({});
  const [animatedProgress, setAnimatedProgress] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const categories = [
    "Food",
    "Travel",
    "Coffee",
    "Drink",
    "Shopping",
    "Other",
    "Savings",
    "Deposit",
  ];

  const presetBudgets = {
    normal: { Food: 25, Travel: 15, Coffee: 5, Drink: 5, Shopping: 10, Other: 10, Savings: 20, Deposit: 10 },
    lowSpending: { Food: 15, Travel: 10, Coffee: 5, Drink: 5, Shopping: 5, Other: 10, Savings: 35, Deposit: 15 },
    highSavings: { Food: 10, Travel: 5, Coffee: 5, Drink: 5, Shopping: 5, Other: 8, Savings: 62, Deposit: 0 },
  };

  useEffect(() => {
    if (user?.monthlyIncome) {
      const initial = presetBudgets.normal;
      const calculated = {};
      categories.forEach(cat => {
        calculated[cat] = Math.round((initial[cat] / 100) * Number(user.monthlyIncome));
      });
      setBudgets(calculated);
      setCustomBudget(calculated);
    }
    if (user?.currency) setCurrency(user.currency);
  }, [user, setCurrency]);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, b) => a + Number(b.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((a, b) => a + Number(b.amount), 0);
  const remainingIncome = totalIncome - totalExpenses;

  const expenseByCategory = transactions.filter(t => t.type === "expense").reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  useEffect(() => {
    const newProgress = {};
    Object.entries(budgets).forEach(([cat, budget]) => {
      const spent = expenseByCategory[cat] || 0;
      newProgress[cat] = budget ? Math.min((spent / budget) * 100, 100) : 0;
    });
    const timer = setTimeout(() => setAnimatedProgress(newProgress), 200);
    return () => clearTimeout(timer);
  }, [budgets, expenseByCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;
    const newTransaction = {
      id: Date.now().toString(),
      type: formData.type,
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
    };
    addTransaction(newTransaction);
    setShowForm(false);
    setFormData({ type: "expense", category: "", amount: "", date: new Date().toISOString().split("T")[0] });
  };

  const handleBudgetChange = (cat, value) => {
    if (selectedProfile !== "custom") return;
    value = Number(value);
    if (value < 0) value = 0;
    const totalOther = Object.entries(budgets).reduce((acc, [c, v]) => c !== cat ? acc + v : acc, 0);
    const maxVal = Math.max(0, Number(user.monthlyIncome) - totalOther);
    if (value > maxVal) value = maxVal;
    const newBudgets = { ...budgets, [cat]: value };
    setBudgets(newBudgets);
    setCustomBudget(newBudgets);
  };

  const getProgressColor = (spent, budget) => {
    if (!budget) return "gray";
    const percent = (spent / budget) * 100;
    if (percent < 70) return "green";
    if (percent <= 100) return "yellow";
    return "red";
  };

  const getTooltip = (cat) => {
    if (selectedProfile !== "custom") return "Read-only budget";
    const totalOther = Object.entries(budgets).reduce((acc, [c, v]) => c !== cat ? acc + v : acc, 0);
    const remaining = Number(user.monthlyIncome) - totalOther;
    return `💡 Max allocatable: ${remaining}`;
  };

  return (
    <div className="space-y-10 p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-r from-green-400 to-green-600 text-white transform hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-3xl font-bold mt-2">{symbol}{totalIncome}</p>
        </div>
        <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-r from-red-400 to-red-600 text-white transform hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-3xl font-bold mt-2">{symbol}{totalExpenses}</p>
        </div>
        <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-r from-blue-400 to-blue-600 text-white transform hover:scale-105 transition">
          <h3 className="text-lg font-semibold">Remaining</h3>
          <p className="text-3xl font-bold mt-2">{symbol}{remainingIncome}</p>
        </div>
      </div>

      {/* Budget Section */}
      {/* Budget Section */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <label className="font-medium">Select Budget Type:</label>
          <select
            className="border rounded-lg p-2 bg-white bg-opacity-90"
            value={selectedProfile}
            onChange={(e) => {
              const profile = e.target.value;
              setSelectedProfile(profile);
              if (profile === "custom") {
                setBudgets(customBudget);
              } else {
                const preset = presetBudgets[profile];
                const newBudgets = {};
                categories.forEach((cat) => {
                  newBudgets[cat] = Math.round(
                    (preset[cat] / 100) * Number(user.monthlyIncome)
                  );
                });
                setBudgets(newBudgets);
              }
            }}
          >
            <option value="normal">Normal</option>
            <option value="lowSpending">Low Spending</option>
            <option value="highSavings">High Savings</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const budget = budgets[cat] || 0;
            const spent = expenseByCategory[cat] || 0;
            const progress = animatedProgress[cat] || 0;
            const color = getProgressColor(spent, budget);
            return (
              <div key={cat} className="space-y-2 relative group">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>
                    {cat}: {symbol}{spent}
                  </span>
                  <span>
                    {selectedProfile === "custom" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">{symbol}</span>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) =>
                            handleBudgetChange(cat, e.target.value)
                          }
                          className="w-20 border rounded-lg p-1 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    ) : (
                      <span>
                        {symbol}{budget}
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
                  <div
                    className={`h-4 transition-all duration-1000 rounded-full`}
                    style={{
                      width: `${progress}%`,
                      background:
                        color === "green"
                          ? "linear-gradient(to right,#34d399,#10b981)"
                          : color === "yellow"
                            ? "linear-gradient(to right,#facc15,#f59e0b)"
                            : "linear-gradient(to right,#f87171,#dc2626)",
                    }}
                  />
                </div>
                {/* Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {getTooltip(cat)}
                </div>
                <p className="text-xs text-gray-600">
                  {spent > budget ? "❌ Over budget" : "✅ Within budget"}
                </p>
              </div>
            );
          })}
        </div>
      </div>


      {/* Recent Transactions */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition">+ Add Transaction</button>
        </div>
        {transactions.slice(-10).reverse().map(t => (
          <div key={t.id} className={`flex justify-between items-center p-3 rounded-xl ${t.type === "income" ? "bg-green-50" : "bg-red-50"} shadow-sm`}>
            <span>{t.category}</span>
            <span>{symbol}{t.amount}</span>
          </div>
        ))}
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full sm:w-96">
            <h3 className="font-bold mb-4">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border p-2 rounded-lg">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2 rounded-lg" required>
                <option value="">Select Category</option>
                {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
              </select>
              <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full border p-2 rounded-lg" />
              <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border p-2 rounded-lg" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard;
