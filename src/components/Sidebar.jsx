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
    <div className="h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 shadow-xl p-4 flex flex-col 
      w-20 sm:w-40 md:w-56 lg:w-64 transition-all duration-300 ">

      {/* Logo */}
      <div className="flex flex-col items-center justify-center p-6 mb-10">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl flex items-center justify-center">
          <GiCrystalGrowth
            className="text-white animate-spin-slow 
                 text-xl sm:text-xl md:text-2xl lg:text-9xl"
          />
        </div>
      </div>
      {/* Nav */}
      <nav className="flex flex-col space-y-3">
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

      {/* Footer */}
      <div className="mt-auto text-xs sm:text-sm text-white/80 px-2 sm:px-4 text-center">
        © 2025 <span className="font-semibold text-white">FinanceGrow</span>
      </div>
    </div>
  );
}

export default Sidebar;
