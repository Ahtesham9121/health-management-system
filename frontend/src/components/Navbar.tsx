import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiUser, FiCalendar, FiGrid } from 'react-icons/fi';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Hospitals', href: '#hospitals' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Specialities', href: '#specialities' },
  ];

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-healthcare-dark/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-lg transition-shadow">
              <span className="text-white font-poppins font-bold text-lg">H</span>
            </div>
            <span className="font-poppins font-bold text-xl text-white hidden sm:block">
              Health<span className="gradient-text">Care</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                    <FiGrid size={16} />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/my-appointments" className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                    <FiCalendar size={16} />
                    <span className="text-sm">My Appointments</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 px-3 py-1.5 glass-card rounded-full">
                  <FiUser size={14} className="text-primary-400" />
                  <span className="text-sm text-gray-300">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center space-x-1 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                  <FiLogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm !px-5 !py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-5 !py-2">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-healthcare-dark/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button key={link.label} onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  {link.label}
                </button>
              ))}
              <hr className="border-white/10 my-2" />
              {isAuthenticated ? (
                <>
                  {isAdmin && <Link to="/dashboard" className="block px-4 py-3 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
                  {!isAdmin && <Link to="/my-appointments" className="block px-4 py-3 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>My Appointments</Link>}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-400">Logout</button>
                </>
              ) : (
                <div className="flex space-x-2 pt-2">
                  <Link to="/login" className="btn-secondary flex-1 text-center text-sm !py-2" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm !py-2" onClick={() => setMobileOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
