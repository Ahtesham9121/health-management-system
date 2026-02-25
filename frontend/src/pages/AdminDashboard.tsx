import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUsers, FiCalendar, FiActivity, FiArrowLeft, FiLogOut, FiTrendingUp, FiClock, FiSettings } from 'react-icons/fi';
import { dashboardAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ManageHospitals from '../components/admin/ManageHospitals';
import ManageDoctors from '../components/admin/ManageDoctors';
import { useWebSocket } from '../context/WebSocketContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Stats {
  totalHospitals: number;
  totalDoctors: number;
  totalAppointments: number;
  totalPatients: number;
  bookedAppointments: number;
  cancelledAppointments: number;
  completedAppointments: number;
}

interface Appointment {
  id: number;
  trackingId: string;
  patientName: string;
  doctorName: string;
  hospitalName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'hospitals' | 'doctors'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppts, setRecentAppts] = useState<Appointment[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { subscribe, unsubscribe, isConnected } = useWebSocket();

  useEffect(() => {
    dashboardAPI.getStats().then(res => setStats(res.data)).catch(() => {});
    appointmentAPI.getRecent().then(res => setRecentAppts(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isConnected) {
      subscribe('/topic/dashboard', (data: Stats) => {
        setStats(data);
      });

      subscribe('/topic/appointments', (appt: Appointment) => {
        setRecentAppts(prev => {
          const filtered = prev.filter(p => p.id !== appt.id);
          const newList = [appt, ...filtered];
          return newList.slice(0, 10);
        });
      });
    }

    return () => {
      unsubscribe('/topic/dashboard');
      unsubscribe('/topic/appointments');
    };
  }, [isConnected, subscribe, unsubscribe]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statCards = [
    { label: 'Hospitals', value: stats?.totalHospitals || 0, icon: <FiHome size={24} />, color: 'from-primary-500/20 to-primary-600/10', textColor: 'text-primary-400' },
    { label: 'Doctors', value: stats?.totalDoctors || 0, icon: <FiUsers size={24} />, color: 'from-accent-500/20 to-accent-600/10', textColor: 'text-accent-400' },
    { label: 'Appointments', value: stats?.totalAppointments || 0, icon: <FiCalendar size={24} />, color: 'from-purple-500/20 to-purple-600/10', textColor: 'text-purple-400' },
    { label: 'Patients', value: stats?.totalPatients || 0, icon: <FiActivity size={24} />, color: 'from-amber-500/20 to-amber-600/10', textColor: 'text-amber-400' },
  ];

  const doughnutData = {
    labels: ['Booked', 'Completed', 'Cancelled'],
    datasets: [{
      data: [stats?.bookedAppointments || 0, stats?.completedAppointments || 0, stats?.cancelledAppointments || 0],
      backgroundColor: ['#338bff', '#1cb37c', '#ef4444'],
      borderColor: ['#338bff', '#1cb37c', '#ef4444'],
      borderWidth: 1,
    }],
  };

  const barData = {
    labels: ['Hospitals', 'Doctors', 'Patients', 'Appointments'],
    datasets: [{
      label: 'Total Count',
      data: [stats?.totalHospitals || 0, stats?.totalDoctors || 0, stats?.totalPatients || 0, stats?.totalAppointments || 0],
      backgroundColor: ['rgba(51, 139, 255, 0.5)', 'rgba(28, 179, 124, 0.5)', 'rgba(245, 158, 11, 0.5)', 'rgba(168, 85, 247, 0.5)'],
      borderColor: ['#338bff', '#1cb37c', '#f59e0b', '#a855f7'],
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#9ca3af' } },
    },
    scales: {
      y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  const statusColors: Record<string, string> = {
    BOOKED: 'bg-primary-500/20 text-primary-400',
    COMPLETED: 'bg-accent-500/20 text-accent-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="min-h-screen bg-healthcare-dark">
      <header className="sticky top-0 z-40 bg-healthcare-dark/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                <FiArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="font-poppins font-bold text-lg text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">Manage your system in real-time</p>
              </div>
            </div>
            <div className="flex gap-4">
               <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all">
                <FiLogOut size={16} />
                <span className="text-sm hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 glass-card rounded-xl w-fit">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-primary-500 text-white shadow-glow' : 'text-gray-400 hover:text-white'}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab('hospitals')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'hospitals' ? 'bg-primary-500 text-white shadow-glow' : 'text-gray-400 hover:text-white'}`}>
            Manage Hospitals
          </button>
          <button onClick={() => setActiveTab('doctors')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'doctors' ? 'bg-primary-500 text-white shadow-glow' : 'text-gray-400 hover:text-white'}`}>
            Manage Doctors
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                  <div key={card.label} className="glass-card p-5 rounded-2xl">
                    <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center ${card.textColor}`}>
                      {card.icon}
                    </div>
                    <p className="text-2xl font-poppins font-bold text-white">{card.value}</p>
                    <p className="text-sm text-gray-400 mt-1">{card.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-poppins font-semibold text-white mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-primary-400" /> System Growth
                  </h3>
                  <Bar data={barData} options={chartOptions} />
                </div>
                <div className="glass-card p-6 rounded-2xl text-center">
                  <h3 className="text-lg font-poppins font-semibold text-white mb-4 flex items-center gap-2 justify-center">
                    <FiActivity className="text-accent-400" /> Appointment Status
                  </h3>
                  <div className="max-w-[250px] mx-auto">
                    <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { labels: { color: '#9ca3af' } } } }} />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h3 className="text-lg font-poppins font-semibold text-white flex items-center gap-2">
                    <FiClock className="text-primary-400" /> Recent Activity
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left p-4 text-gray-400 font-medium">Tracking ID</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Patient</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Doctor</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppts.length > 0 ? recentAppts.map((appt) => (
                        <tr key={appt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-primary-400 font-mono text-xs">{appt.trackingId}</td>
                          <td className="p-4 text-white font-medium">{appt.patientName}</td>
                          <td className="p-4 text-gray-300">{appt.doctorName}</td>
                          <td className="p-4 text-gray-300">{appt.appointmentDate}</td>
                          <td className="p-4 text-gray-300">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[appt.status] || 'bg-gray-500/20 text-gray-400'}`}>
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500 italic">No recent activity detected</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'hospitals' && (
             <motion.div key="hospitals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ManageHospitals />
             </motion.div>
          )}

          {activeTab === 'doctors' && (
             <motion.div key="doctors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ManageDoctors />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
