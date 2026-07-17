import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings, FiMenu, FiChevronLeft } from "react-icons/fi";

/**
 * Sidebar – navigation menu for the admin dashboard.
 * Features:
 *   • Collapsible (compact) mode with a toggle button.
 *   • Uses React Router NavLink for active link styling.
 *   • Tailwind CSS, dark‑mode aware, with subtle hover animations.
 *   • Icons from react‑icons for visual polish.
 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((prev) => !prev);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FiHome /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingCart /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers /> },
    { name: "Products", path: "/admin/products", icon: <FiBox /> },
    { name: "Settings", path: "/admin/settings", icon: <FiSettings /> },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 h-screen shadow-md transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Admin</h2>}
        <button
          onClick={toggle}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 px-4 rounded-md transition-colors hover:bg-indigo-100 dark:hover:bg-gray-700 ${
                isActive ? "bg-indigo-200 dark:bg-indigo-600 text-indigo-900" : "text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
