import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { login } = useContext(AuthContext);
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
      return setErr('Select at least one role.');
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...form,
        selectedRoles: form.roles
      });
      alert('Registered! Please log in.');
      navigate('/login');
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Create an account</h2>
        {err && <p className="text-red-500 mb-2">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={() => toggleRole('student')}
              />
              Student
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={() => toggleRole('educator')}
              />
              Educator
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
