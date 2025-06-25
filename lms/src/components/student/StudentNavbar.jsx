import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo_image.png'; // Update path as needed

const StudentNavbar = () => {
  const { auth, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const switchToEducator = () => {
    const user = auth.user;
    if (user?.roles?.educator) {
      const updatedUser = { ...user, currentRole: 'educator' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(auth.token, updatedUser);
      navigate('/educator');
    }
  };

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
        <div className="hidden md:flex items-center space-x-6 text-blue-600 font-medium">
          <Link to="/" className="hover:text-blue-800 transition">Home</Link>
          <Link to="/student/dashboard" className="hover:text-blue-800 transition">Dashboard</Link>
          <Link to="/student/enrollments" className="hover:text-blue-800 transition">My Enrollments</Link>
          <Link to="/student/ai-doubt-solver" className="hover:text-blue-800 transition">AI Doubt Solver</Link>
          <Link to="/student/ai-quiz-taker" className="hover:text-blue-800 transition">AI Quiz Taker</Link>

          {auth.user?.roles?.educator && (
            <button
              onClick={switchToEducator}
              className="border border-blue-600 px-4 py-1 rounded-full hover:bg-blue-600 hover:text-white transition"
            >
              Switch to Educator
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
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
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-blue-800">Home</Link>
          <Link to="/student/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-blue-800">Dashboard</Link>
          <Link to="/student/enrollments" onClick={() => setMenuOpen(false)} className="block hover:text-blue-800">My Enrollments</Link>
          <Link to="/student/ai-doubt-solver" onClick={() => setMenuOpen(false)} className="block hover:text-blue-800">AI Doubt Solver</Link>
          <Link to="/student/ai-quiz-taker" onClick={() => setMenuOpen(false)} className="block hover:text-blue-800">AI Quiz Taker</Link>

          {auth.user?.roles?.educator && (
            <button
              onClick={() => {
                setMenuOpen(false);
                switchToEducator();
              }}
              className="block w-full text-left hover:text-blue-800"
            >
              Switch to Educator
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

export default StudentNavbar;
