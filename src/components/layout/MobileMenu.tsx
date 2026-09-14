import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Package, MessageSquare } from "lucide-react";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">Menu</span>
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          <Link to="/products" onClick={toggleMenu} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <Package size={18} /> Browse Items
          </Link>
          <Link to="/dashboard" onClick={toggleMenu} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <User size={18} /> Dashboard
          </Link>
          <Link to="/dashboard/chat" onClick={toggleMenu} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <MessageSquare size={18} /> Messages
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;