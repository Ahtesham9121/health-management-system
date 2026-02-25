import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHome, FiUsers, FiCalendar, FiBell } from 'react-icons/fi';
import { hospitalAPI, doctorAPI } from '../services/api';

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection() {
  const [stats, setStats] = useState({ hospitals: 0, doctors: 0, patients: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hospRes, docRes] = await Promise.all([
          hospitalAPI.getAll({ page: 0, size: 1 }),
          doctorAPI.getAll({ page: 0, size: 1 }),
        ]);
        setStats({
          hospitals: hospRes.data.totalElements || 12,
          doctors: docRes.data.totalElements || 20,
          patients: 1500,
        });
      } catch {
        setStats({ hospitals: 12, doctors: 20, patients: 1500 });
      }
    };
    fetchStats();
  }, []);

  const scrollToBooking = () => {
    const el = document.querySelector('#hospitals');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-dark via-healthcare-navy to-primary-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[150px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-card rounded-full mb-6">
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Smart Healthcare Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold leading-tight mb-6">
              Your Health,{' '}
              <span className="gradient-text">Our Priority</span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
              Connect with top hospitals and experienced doctors across India.
              Book appointments instantly, track in real-time, and manage your healthcare journey seamlessly.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={scrollToBooking} className="btn-primary flex items-center space-x-2 text-lg !px-8 !py-4">
                <span>Book Appointment</span>
                <FiArrowRight />
              </button>
              <button onClick={() => document.querySelector('#doctors')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary flex items-center space-x-2 text-lg !px-8 !py-4">
                <span>Find Doctors</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Hospitals', value: stats.hospitals, suffix: '+' },
                { label: 'Doctors', value: stats.doctors, suffix: '+' },
                { label: 'Patients', value: stats.patients, suffix: '+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-poppins font-bold text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl blur-xl" />
              <div className="relative glass-card p-8 rounded-3xl">
                <div className="space-y-4">
                  {/* Mock Cards */}
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                      <FiHome size={24} className="text-primary-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Find Hospitals</div>
                      <div className="text-gray-400 text-sm">Browse top-rated hospitals near you</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
                      <FiUsers size={24} className="text-accent-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Expert Doctors</div>
                      <div className="text-gray-400 text-sm">Connect with specialized physicians</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                      <FiCalendar size={24} className="text-primary-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Easy Booking</div>
                      <div className="text-gray-400 text-sm">Schedule appointments in minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
                      <FiBell size={24} className="text-accent-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Real-time Updates</div>
                      <div className="text-gray-400 text-sm">Get instant notifications on your appointments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
