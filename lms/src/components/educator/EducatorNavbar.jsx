import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import logo from '../../assets/logo_image.png'; // Adjust path to your actual logo
import axios from 'axios';
import { toast } from 'react-toastify';

const EducatorNavbar = () => {
  const { auth, logout, login } = useContext(AuthContext);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRoleSwitch = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/switch-role`,
        { newRole: 'student' },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      login(data.token, data.user);
      navigate('/');
      toast.success('Switched to Student role');
    } catch (error) {
      toast.error('Failed to switch role. Please try again.');
      console.error('Role switch failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 border-b border-blue-100 position-sticky">
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
        <div className="hidden md:flex items-center space-x-6 text-blue-600 font-medium">

          {auth.user?.roles?.student && (
            <button
              onClick={handleRoleSwitch}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Switch to Student
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
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
        <div className="md:hidden bg-white px-6 pt-4 pb-6 space-y-4 shadow-lg border-t border-blue-100 text-blue-600 font-medium">
          <Link to="/educator/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-blue-800">Dashboard</Link>
          <Link to="/educator/add-course" onClick={() => setMenuOpen(false)} className="block hover:text-blue-800">Create Course</Link>

          {auth.user?.roles?.student && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleRoleSwitch();
              }}
              className="block w-full text-left hover:text-blue-800"
            >
              Switch to Student
            </button>
          )}

          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-full text-center hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default EducatorNavbar;