import NavLink from "./Navlink";
import { supabase } from "@/libs/supabase";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaList,
  FaWarehouse,
  FaTag,
  FaCalendarAlt,
  FaClipboardList,
  FaUser,
  FaFileInvoice,
  FaPuzzlePiece,
  FaUsers,
  FaTable,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Gagal logout");
      console.error(error);
      return;
    }

    toggleSidebar();

    navigate("/", { replace: true });
  };
  return (
    <>
      {/* Overlay (muncul di mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] lg:hidden transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-[9999] bg-white shadow-md p-6 flex flex-col justify-between overflow-y-auto scrollbar-hide
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`} // selalu tampil di layar besar
      >
        <div>
          {/* Logo */}
          <div className="justify-center mb-8 text-center">
            <img src="/image/Logo.png" alt="Logo" className="w-40 h-auto mx-auto" />
          </div>

          {/* Main Menu */}
          <nav className="space-y-2">
            <NavLink to="/dashboard"><FaTachometerAlt /><span>Dashboard</span></NavLink>
            <NavLink to="/product"><FaBox /><span>Product</span></NavLink>
            <NavLink to="/orders"><FaList /><span>Order Lists</span></NavLink>
            <NavLink to="/stock"><FaWarehouse /><span>Product Stock</span></NavLink>
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Pages */}
          <div className="space-y-2">
            <div className="uppercase text-xs text-gray-400 mb-2">Pages</div>
            <NavLink to="/pricing"><FaTag /><span>Pricing</span></NavLink>
            <NavLink to="/calendar"><FaCalendarAlt /><span>Calendar</span></NavLink>
            <NavLink to="/todo"><FaClipboardList /><span>To-Do</span></NavLink>
            <NavLink to="/contact"><FaUser /><span>Contact</span></NavLink>
            <NavLink to="/invoice"><FaFileInvoice /><span>Invoice</span></NavLink>
            <NavLink to="/ui-elements"><FaPuzzlePiece /><span>UI Elements</span></NavLink>
            <NavLink to="/team"><FaUsers /><span>Team</span></NavLink>
            <NavLink to="/table"><FaTable /><span>Table</span></NavLink>
          </div>
        </div>

        {/* Settings & Logout */}
        <div className="space-y-2">
          <NavLink to="/settings"><FaCog /><span>Settings</span></NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-500 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
