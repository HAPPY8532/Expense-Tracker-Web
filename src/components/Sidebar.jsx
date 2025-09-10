import { NavLink } from "react-router-dom";
import { LayoutDashboard, List, BarChart3, Settings } from "lucide-react";
import { GiCrystalGrowth } from "react-icons/gi";

function Sidebar() {
  const baseClasses =
    "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300";

  const getClasses = ({ isActive }) =>
    isActive
      ? `${baseClasses} bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg scale-105`
      : `${baseClasses} text-gray-100 hover:bg-white/20 hover:text-white`;

  return (
    <div
      className="
        w-full h-[10vh] flex items-center justify-between px-4
        bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-xl
        sm:w-64 sm:h-screen sm:flex-col sm:items-center sm:justify-start sm:px-4 sm:py-6
        transition-all duration-300
      "
    >
      {/* Logo */}
      <div className="flex items-center sm:flex-col sm:mb-10">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-3 sm:p-6 rounded-2xl shadow-2xl flex items-center justify-center">
          <GiCrystalGrowth className="text-white animate-spin-slow text-2xl sm:text-4xl lg:text-6xl" />
        </div>
        <span className="ml-3 sm:ml-0 sm:mt-4 text-white font-bold hidden sm:block">
          FinanceGrow
        </span>
      </div>

      {/* Nav */}
      <nav className="flex gap-4 sm:flex-col sm:space-y-3">
        <NavLink to="/" end className={getClasses}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </NavLink>
        <NavLink to="transactions" className={getClasses}>
          <List className="h-5 w-5" />
          <span className="hidden sm:inline">Transactions</span>
        </NavLink>
        <NavLink to="reports" className={getClasses}>
          <BarChart3 className="h-5 w-5" />
          <span className="hidden sm:inline">Reports</span>
        </NavLink>
        <NavLink to="settings" className={getClasses}>
          <Settings className="h-5 w-5" />
          <span className="hidden sm:inline">Settings</span>
        </NavLink>
      </nav>

      {/* Footer (only desktop) */}
      <div className="hidden sm:block mt-auto text-xs sm:text-sm text-white/80 px-2 sm:px-4 text-center">
        © 2025 <span className="font-semibold text-white">FinanceGrow</span>
      </div>
    </div>
  );
}

export default Sidebar;
