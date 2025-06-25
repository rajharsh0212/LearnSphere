import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
      const res = await axios.post('http://localhost:5000/api/auth/login', {
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
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Sign in</h2>
        {err && <p className="text-red-500 mb-2">{err}</p>}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full ${role === 'student' ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 rounded-full ${role === 'educator' ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`}
            onClick={() => setRole('educator')}
          >
            Educator
          </button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
