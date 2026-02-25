import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiLogOut, FiSearch, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  id: number;
  trackingId: string;
  doctorName: string;
  hospitalName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState('');
  const [trackedAppt, setTrackedAppt] = useState<Appointment | null>(null);
  const [trackError, setTrackError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    appointmentAPI.getMyAppointments()
      .then(res => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    setTrackError('');
    setTrackedAppt(null);
    try {
      const res = await appointmentAPI.getByTracking(trackingId.trim());
      setTrackedAppt(res.data);
    } catch {
      setTrackError('Appointment not found. Please check the tracking ID.');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch {
      alert('Failed to cancel appointment');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    BOOKED: { color: 'bg-primary-500/20 text-primary-400 border-primary-500/30', icon: <FiCalendar size={14} /> },
    COMPLETED: { color: 'bg-accent-500/20 text-accent-400 border-accent-500/30', icon: <FiCheckCircle size={14} /> },
    CANCELLED: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <FiXCircle size={14} /> },
  };

  return (
    <div className="min-h-screen bg-healthcare-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-healthcare-dark/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors"><FiArrowLeft size={20} /></Link>
              <div>
                <h1 className="font-poppins font-bold text-lg text-white">My Appointments</h1>
                <p className="text-xs text-gray-400">Hi, {user?.name}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all">
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Track Appointment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl mb-8">
          <h2 className="text-lg font-poppins font-semibold text-white mb-4 flex items-center gap-2">
            <FiSearch className="text-primary-400" /> Track Appointment
          </h2>
          <div className="flex gap-3">
            <input type="text" className="input-field flex-1" placeholder="Enter tracking ID (e.g., HCMS-2026-0001)"
              value={trackingId} onChange={e => setTrackingId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()} />
            <button onClick={handleTrack} className="btn-primary !px-6">Track</button>
          </div>
          {trackError && <p className="text-red-400 text-sm mt-3">{trackError}</p>}
          {trackedAppt && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-primary-400 font-mono text-sm mb-1">{trackedAppt.trackingId}</p>
                  <p className="text-white font-medium">{trackedAppt.doctorName}</p>
                  <p className="text-gray-400 text-sm">{trackedAppt.hospitalName}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><FiCalendar size={12} /> {trackedAppt.appointmentDate}</span>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {trackedAppt.appointmentTime}</span>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 ${statusConfig[trackedAppt.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                  {statusConfig[trackedAppt.status]?.icon} {trackedAppt.status}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Appointments List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-poppins font-semibold text-white mb-4">Your Appointments</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appt, i) => (
                <motion.div key={appt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 rounded-2xl hover:bg-white/5 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-primary-400 font-mono text-xs bg-primary-500/10 px-2 py-1 rounded">{appt.trackingId}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusConfig[appt.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                          {statusConfig[appt.status]?.icon} {appt.status}
                        </span>
                      </div>
                      <p className="text-white font-medium">{appt.doctorName}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><FiMapPin size={12} className="text-primary-400" /> {appt.hospitalName}</span>
                        <span className="flex items-center gap-1"><FiCalendar size={12} /> {appt.appointmentDate}</span>
                        <span className="flex items-center gap-1"><FiClock size={12} /> {appt.appointmentTime}</span>
                      </div>
                    </div>
                    {appt.status === 'BOOKED' && (
                      <button onClick={() => handleCancel(appt.id)}
                        className="text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-all whitespace-nowrap">
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 rounded-2xl text-center">
              <div className="mb-4 flex justify-center"><FiCalendar size={40} className="text-gray-500" /></div>
              <p className="text-gray-400 text-lg mb-2">No appointments yet</p>
              <p className="text-gray-500 text-sm mb-6">Book your first appointment from the home page</p>
              <Link to="/" className="btn-primary inline-block">Browse Hospitals</Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
