import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBriefcase } from 'react-icons/fi';
import { doctorAPI } from '../services/api';
import DoctorDetailsModal from './DoctorDetailsModal';
import AppointmentModal from './AppointmentModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: number;
  name: string;
  degree: string;
  specialization: string;
  experienceYears: number;
  hospitalId: number;
  hospitalName: string;
  imageUrl: string;
}

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    doctorAPI.getAll({ page: 0, size: 8 })
      .then(res => setDoctors(res.data.content || []))
      .catch(() => {});
  }, []);

  const handleCardClick = (doctor: Doctor) => {
      setSelectedDoctor(doctor);
      setShowDetailsModal(true);
  };

  const handleBookClick = (e: React.MouseEvent, doctor: Doctor) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  return (
    <section id="doctors" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="section-title">Our <span className="gradient-text">Expert Doctors</span></h2>
          <p className="section-subtitle">Highly qualified physicians dedicated to your well-being</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCardClick(doctor)}
              className="glass-card-hover rounded-2xl overflow-hidden group text-center cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={doctor.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'}
                  alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-healthcare-dark/90 via-transparent to-transparent" />
              </div>
              <div className="p-5 -mt-6 relative">
                <h3 className="text-lg font-poppins font-semibold text-white mb-1">{doctor.name}</h3>
                <p className="text-primary-400 text-sm font-medium mb-2">{doctor.specialization}</p>
                <p className="text-gray-500 text-xs mb-3">{doctor.degree}</p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <FiBriefcase size={12} className="text-accent-400" />
                    {doctor.experienceYears} yrs
                  </span>
                  <span className="flex items-center gap-1">
                    <FiAward size={12} className="text-primary-400" />
                    {doctor.hospitalName}
                  </span>
                </div>
                <button onClick={(e) => handleBookClick(e, doctor)}
                  className="w-full btn-primary text-sm !py-2.5 !rounded-xl relative z-10">
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showDetailsModal && selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={() => { setShowDetailsModal(false); setSelectedDoctor(null); }}
        />
      )}

      {showBookingModal && selectedDoctor && (
        <AppointmentModal
          doctor={selectedDoctor}
          onClose={() => { setShowBookingModal(false); setSelectedDoctor(null); }}
        />
      )}
    </section>
  );
}
