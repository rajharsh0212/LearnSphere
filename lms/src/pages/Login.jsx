import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo_image.png'; // Assuming you have a logo to import

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [err, setErr] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
        loginRole: role
      });
      login(res.data.token, res.data.user);
      navigate(role === 'student' ? '/' : '/educator');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 pt-16">
      {/* Left Pane: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 flex-col justify-center items-center p-12 text-white">
        <h1 className="text-5xl font-extrabold mb-4">Welcome Back to LearnSphere</h1>
        <p className="text-xl text-blue-100">Your journey to knowledge continues here. Log in to access your world of learning.</p>
      </div>

      {/* Right Pane: Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 sm:p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Log In</h2>
          
          {err && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{err}</p>}

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-gray-200 p-1 rounded-lg mb-6">
            <button
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${role === 'student' ? 'bg-white text-blue-600 shadow' : 'bg-transparent text-gray-600 hover:bg-white/50'}`}
              onClick={() => setRole('student')}
            >
              I'm a Student
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${role === 'educator' ? 'bg-white text-blue-600 shadow' : 'bg-transparent text-gray-600 hover:bg-white/50'}`}
              onClick={() => setRole('educator')}
            >
              I'm an Educator
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <span 
              className="text-blue-600 hover:underline cursor-pointer font-semibold" 
              onClick={() => navigate('/register')}
            >
              Register now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;