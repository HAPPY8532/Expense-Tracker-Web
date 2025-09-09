// src/components/Navbar.jsx
import { GiCrystalGrowth } from "react-icons/gi";
import { useAuth } from "./AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md px-6 py-3 flex justify-between items-center transition-colors duration-500">
      
      {/* Left - Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-lg">
          <GiCrystalGrowth className="text-3xl text-blue-500 animate-spin-slow" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">
          FinanceGrow
        </h1>
      </div>

      {/* Right - User Avatar & Welcome */}
      <div className="flex items-center space-x-4">
        {/* Welcome message (hidden on small screens) */}
        {user && (
          <span className="hidden md:flex items-center gap-2 text-white font-medium text-sm md:text-base">
            🌟 Welcome, {user.name}!
          </span>
        )}

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-md overflow-hidden">
          <img
            src={user?.avatar || "https://i.pravatar.cc/100"}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
