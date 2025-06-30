import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roles: []
  });
  const [err, setErr] = useState('');

  const toggleRole = role => setForm(prev => {
    const roles = prev.roles.includes(role)
      ? prev.roles.filter(r => r !== role)
      : [...prev.roles, role];
    return { ...prev, roles };
  });

  const submit = async e => {
    e.preventDefault();
    if (!form.roles.length) {
      return setErr('Please select at least one role to continue.');
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...form,
        selectedRoles: form.roles
      });
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (e) {
      setErr(e.response?.data?.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 pt-16">
      {/* Left Pane: Branding */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 sm:p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>
          
          {err && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{err}</p>}

          <form onSubmit={submit} className="space-y-6">
            <input name="name" placeholder="Full Name" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" onChange={e => setForm({ ...form, name: e.target.value })} />
            <input name="email" type="email" placeholder="Email Address" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" onChange={e => setForm({ ...form, email: e.target.value })} />
            <input name="password" type="password" placeholder="Password" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" onChange={e => setForm({ ...form, password: e.target.value })} />

            {/* Role Checkboxes */}
            <div className="space-y-4">
              <p className="font-semibold text-gray-700">I want to be a...</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all w-full ${form.roles.includes('student') ? 'bg-blue-50 border-blue-400' : 'border-gray-300'}`}>
                  <input type="checkbox" className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" onChange={() => toggleRole('student')} checked={form.roles.includes('student')} />
                  <span className="ml-3 text-gray-800 font-medium">Student</span>
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all w-full ${form.roles.includes('educator') ? 'bg-blue-50 border-blue-400' : 'border-gray-300'}`}>
                  <input type="checkbox" className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" onChange={() => toggleRole('educator')} checked={form.roles.includes('educator')} />
                  <span className="ml-3 text-gray-800 font-medium">Educator</span>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
              Create Account
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <span className="text-blue-600 hover:underline cursor-pointer font-semibold" onClick={() => navigate('/login')}>
              Log In
            </span>
          </p>
        </div>
      </div>
      
      {/* Right Pane: Info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 flex-col justify-center items-center p-12 text-white">
        <h1 className="text-5xl font-extrabold mb-4">Join LearnSphere Today</h1>
        <p className="text-xl text-blue-100">Unlock a universe of knowledge. Choose your role and start your journey with us.</p>
      </div>
    </div>
  );
};

export default Register;