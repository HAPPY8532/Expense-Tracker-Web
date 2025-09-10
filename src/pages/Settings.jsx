import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

function Settings() {
  const { user, setUser, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    transactionAlerts: true,
    newsletter: false,
    promo: true,
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    occupation: "",
    monthlyIncome: "",
    currency: "INR",
    avatar: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        occupation: user.occupation || "",
        monthlyIncome: user.monthlyIncome || "",
        currency: user.currency || "INR",
        avatar: user.avatar || null,
      });
    }
  }, [user]);

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, ...profile } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const updatedUser = { ...user, ...profile };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    setIsEditing(false);
    alert("🎉 Profile updated successfully!");
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        occupation: user.occupation || "",
        monthlyIncome: user.monthlyIncome || "",
        currency: user.currency || "INR",
        avatar: user.avatar || null,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200">
          ⚙️ Settings
        </h1>
        <p className="text-white mt-2 text-lg md:text-xl">
          Manage your profile & preferences with style 🚀
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Notifications Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4 border-t-4 border-green-400 
                        hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-500">
          <h2 className="text-2xl font-bold text-green-600">🔔 Notifications</h2>
          <div className="flex flex-col gap-4">
            {Object.entries(notifications).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center justify-between p-4 rounded-2xl cursor-pointer bg-gray-50 hover:bg-green-200 transition-all"
              >
                <span className="capitalize font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <div
                  className={`w-14 h-7 rounded-full p-1 flex items-center transition-all duration-300 ${
                    value
                      ? "bg-gradient-to-r from-green-400 to-teal-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() =>
                    setNotifications({ ...notifications, [key]: !value })
                  }
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                      value ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-6 border-t-4 border-purple-400 
                        hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-100 transition-all duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-purple-600">👤 Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-500 text-white text-sm rounded-xl shadow hover:bg-purple-600 transition"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            /* Detail View */
            <div className="space-y-4">
              {profile.avatar && (
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full shadow-lg mx-auto border-4 border-purple-300"
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-xl shadow">
                  <span className="block text-xs font-bold text-purple-500">Name</span>
                  <span className="text-gray-800 font-medium">{profile.name || "—"}</span>
                </div>
                <div className="p-3 bg-pink-50 rounded-xl shadow">
                  <span className="block text-xs font-bold text-pink-500">Email</span>
                  <span className="text-gray-800 font-medium">{profile.email || "—"}</span>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl shadow">
                  <span className="block text-xs font-bold text-indigo-500">Age</span>
                  <span className="text-gray-800 font-medium">{profile.age || "—"}</span>
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl shadow">
                  <span className="block text-xs font-bold text-cyan-500">Occupation</span>
                  <span className="text-gray-800 font-medium">{profile.occupation || "—"}</span>
                </div>
                <div className="p-3 bg-green-50 rounded-xl shadow">
                  <span className="block text-xs font-bold text-green-500">Monthly Income</span>
                  <span className="text-gray-800 font-medium">{profile.monthlyIncome || "—"}</span>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl shadow">
                  <span className="block text-xs font-bold text-yellow-500">Currency</span>
                  <span className="text-gray-800 font-medium">{profile.currency}</span>
                </div>
              </div>

              {/* Logout inside Profile */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={logout}
                  className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-2xl shadow-lg hover:scale-110 transition duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <div className="flex flex-col gap-5">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Name"
                className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Email"
                className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                placeholder="Age"
                className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) =>
                  setProfile({ ...profile, occupation: e.target.value })
                }
                placeholder="Occupation"
                className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="number"
                value={profile.monthlyIncome}
                onChange={(e) =>
                  setProfile({ ...profile, monthlyIncome: e.target.value })
                }
                placeholder="Monthly Income"
                className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
              />

              <select
                value={profile.currency}
                onChange={(e) =>
                  setProfile({ ...profile, currency: e.target.value })
                }
                className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>

              {/* Save / Cancel */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-xl shadow hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
