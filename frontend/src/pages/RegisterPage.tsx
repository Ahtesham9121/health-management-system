import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register(name, email, password);
      const { token, id, name: userName, email: userEmail, role } = res.data;
      login(token, { id, name: userName, email: userEmail, role });
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-healthcare-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative glass-card w-full max-w-md p-8 rounded-2xl">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-white font-poppins font-bold text-xl">H</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-1">Join our healthcare platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2"><FiUser className="inline mr-1" /> Full Name</label>
            <input type="text" className="input-field" placeholder="John Doe"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2"><FiMail className="inline mr-1" /> Email</label>
            <input type="email" className="input-field" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2"><FiLock className="inline mr-1" /> Password</label>
            <input type="password" className="input-field" placeholder="Min. 8 characters"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2"><FiLock className="inline mr-1" /> Confirm Password</label>
            <input type="password" className="input-field" placeholder="Confirm password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
