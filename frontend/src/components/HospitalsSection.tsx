import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiStar, FiChevronLeft, FiChevronRight, FiShield, FiClock } from 'react-icons/fi';
import { hospitalAPI, locationAPI } from '../services/api';

interface Hospital {
  id: number;
  name: string;
  state: string;
  city: string;
  type: string;
  rating: number;
  emergency24x7: boolean;
  insuranceSupported: boolean;
  imageUrl: string;
}

import AppointmentModal from './AppointmentModal';

export default function HospitalsSection() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [filters, setFilters] = useState({ state: '', city: '', type: '', search: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, size: 6 };
      if (filters.state) params.state = filters.state;
      if (filters.city) params.city = filters.city;
      if (filters.type) params.type = filters.type;
      if (filters.search) params.search = filters.search;
      const res = await hospitalAPI.getAll(params);
      setHospitals(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    const timer = setTimeout(fetchHospitals, 300);
    return () => clearTimeout(timer);
  }, [fetchHospitals]);

  useEffect(() => {
    locationAPI.getStates().then(res => setStates(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (filters.state) {
      const stateObj = states.find(s => s.name === filters.state);
      if (stateObj) {
        locationAPI.getCities(stateObj.id).then(res => setCities(res.data)).catch(() => {});
      }
    } else {
      setCities([]);
      setFilters(f => ({ ...f, city: '' }));
    }
  }, [filters.state, states]);

  return (
    <section id="hospitals" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="section-title">Top <span className="gradient-text">Hospitals</span></h2>
          <p className="section-subtitle">Discover world-class healthcare facilities across India</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card p-6 rounded-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search hospitals..." className="input-field !pl-10"
                value={filters.search} onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(0); }} />
            </div>
            <select className="select-field" value={filters.state}
              onChange={e => { setFilters(f => ({ ...f, state: e.target.value, city: '' })); setPage(0); }}>
              <option value="">All States</option>
              {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <select className="select-field" value={filters.city}
              onChange={e => { setFilters(f => ({ ...f, city: e.target.value })); setPage(0); }}>
              <option value="">All Cities</option>
              {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select className="select-field" value={filters.type}
              onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(0); }}>
              <option value="">All Types</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </motion.div>

        {/* Hospital Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-72 animate-pulse">
                <div className="h-40 bg-white/5 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : hospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital, index) => (
              <motion.div key={hospital.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-hover rounded-2xl overflow-hidden group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={hospital.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600'}
                    alt={hospital.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${hospital.type === 'Government' ? 'bg-accent-500/80 text-white' : 'bg-primary-500/80 text-white'}`}>
                      {hospital.type}
                    </span>
                  </div>
                  {hospital.rating && (
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                      <span className="text-white text-sm font-medium">{hospital.rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-poppins font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <FiMapPin size={14} className="mr-1 text-primary-400" />
                    {hospital.city}, {hospital.state}
                  </div>
                  <div className="flex gap-3 mb-4">
                    {hospital.emergency24x7 && (
                      <div className="flex items-center text-xs text-accent-400">
                        <FiClock size={12} className="mr-1" /> 24x7
                      </div>
                    )}
                    {hospital.insuranceSupported && (
                      <div className="flex items-center text-xs text-primary-400">
                        <FiShield size={12} className="mr-1" /> Insurance
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => { 
                      if (!localStorage.getItem('token')) {
                        window.location.href = '/login';
                        return;
                      }
                      setSelectedHospital(hospital); 
                      setShowModal(true); 
                    }}
                    className="w-full btn-primary text-sm !py-2 !rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hospitals found matching your filters.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-10">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-2 glass-card rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all">
              <FiChevronLeft size={20} />
            </button>
            <span className="text-gray-300 text-sm">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="p-2 glass-card rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all">
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      {showModal && selectedHospital && (
        <AppointmentModal 
            hospital={selectedHospital}
            onClose={() => { setShowModal(false); setSelectedHospital(null); }}
        />
      )}
    </section>
  );
}
