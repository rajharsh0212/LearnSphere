import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import logo from "../assets/logo_image.png"; // Adjust path as necessary

const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-100 shadow-md fixed w-full z-50 top-0 left-0 border-b border-blue-100">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src={logo}
            alt="LearnSphere Logo"
            className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600 tracking-wide group-hover:text-blue-700">
            LearnSphere
          </span>
        </Link>


        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/login"
            className="text-base sm:text-lg font-medium text-blue-600 hover:text-blue-800 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-base sm:text-lg font-medium bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-blue-600 focus:outline-none"
          >
            {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pt-4 pb-6 space-y-4 shadow-lg border-t border-blue-100">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-medium text-blue-600 hover:text-blue-800"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-medium text-white bg-blue-600 py-2 px-4 rounded-full text-center hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
