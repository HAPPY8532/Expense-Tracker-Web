import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  // Signup
  const signup = (name, email, password, age, occupation, monthlyIncome, currency, avatar) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email)) {
      return { error: "Email already exists" };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      age,
      occupation,
      monthlyIncome,
      currency,
      avatar,
      transactions: [], // fresh transactions for new user
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);

    return { success: true };
  };

  // Login
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existing = users.find((u) => u.email === email && u.password === password);
    if (!existing) return { error: "Invalid email or password" };

    localStorage.setItem("currentUser", JSON.stringify(existing));
    setUser(existing);
    return { success: true };
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => useContext(AuthContext);
