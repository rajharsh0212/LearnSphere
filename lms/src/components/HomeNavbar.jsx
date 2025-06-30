import { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import logo from "../assets/logo_image.png"; // Adjust path as necessary
import { assets } from '../assets/assets';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const NavLinkItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `text-base font-medium transition-colors duration-300 ${
        isActive
          ? 'text-blue-600'
          : 'text-gray-600 hover:text-blue-600'
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileNavLinkItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block py-3 text-lg font-medium transition-colors duration-300 ${
        isActive
          ? 'text-blue-600'
          : 'text-gray-600 hover:text-blue-600'
      }`
    }
  >
    {children}
  </NavLink>
);

const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { auth } = useContext(AuthContext);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
    toast.success("Logged out successfully!");
  };

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="LearnSphere Logo"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-blue-600">LearnSphere</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinkItem to="/about">About Us</NavLinkItem>
            <NavLinkItem to="/contact">Contact</NavLinkItem>
            <NavLinkItem to="/course-list">Courses</NavLinkItem>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              Log In
            </Link>
            <Link to="/register" className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
              Sign Up
            </Link>
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div 
        className={`md:hidden absolute top-full right-4 w-80 mt-2 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out origin-top-right ${
          menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="p-4">
          <div className="space-y-2">
            <MobileNavLinkItem to="/about" onClick={() => setMenuOpen(false)}>About Us</MobileNavLinkItem>
            <MobileNavLinkItem to="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileNavLinkItem>
            <MobileNavLinkItem to="/course-list" onClick={() => setMenuOpen(false)}>Courses</MobileNavLinkItem>
          </div>
          <div className="border-t border-gray-100 my-4"></div>
          <div className="space-y-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-300 py-3 rounded-lg border border-gray-300"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
