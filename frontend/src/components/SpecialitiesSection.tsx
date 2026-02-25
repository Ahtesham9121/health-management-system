import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { specialityAPI } from '../services/api';
import { FiHeart, FiEye, FiActivity, FiSmile, FiZap, FiSun, FiWind, FiShield, FiTarget, FiCpu, FiDroplet, FiThermometer } from 'react-icons/fi';

const iconMap: Record<string, React.ReactNode> = {
  heart: <FiHeart size={28} />,
  skin: <FiSun size={28} />,
  brain: <FiCpu size={28} />,
  bone: <FiActivity size={28} />,
  child: <FiSmile size={28} />,
  eye: <FiEye size={28} />,
  ear: <FiZap size={28} />,
  stomach: <FiDroplet size={28} />,
  lungs: <FiWind size={28} />,
  ribbon: <FiTarget size={28} />,
  mind: <FiShield size={28} />,
  stethoscope: <FiThermometer size={28} />,
};

interface Speciality {
  id: number;
  name: string;
  description: string;
  iconName: string;
}

import SpecialistDetailsModal from './SpecialistDetailsModal';

export default function SpecialitiesSection() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<Speciality | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    specialityAPI.getAll()
      .then(res => setSpecialities(res.data))
      .catch(() => {});
  }, []);

  const colors = [
    'from-primary-500/20 to-primary-600/10 text-primary-400',
    'from-accent-500/20 to-accent-600/10 text-accent-400',
    'from-purple-500/20 to-purple-600/10 text-purple-400',
    'from-rose-500/20 to-rose-600/10 text-rose-400',
    'from-amber-500/20 to-amber-600/10 text-amber-400',
    'from-cyan-500/20 to-cyan-600/10 text-cyan-400',
  ];

  return (
    <section id="specialities" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="section-title">Medical <span className="gradient-text">Specialities</span></h2>
          <p className="section-subtitle">Browse our comprehensive range of medical specializations</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {specialities.map((spec, index) => (
            <motion.div key={spec.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => { setSelectedSpeciality(spec); setShowModal(true); }}
              className="glass-card p-5 rounded-2xl text-center cursor-pointer group transition-all duration-300 hover:bg-white/10"
              title={spec.description}
            >
              <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {iconMap[spec.iconName] || <FiActivity size={28} />}
              </div>
              <h3 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">{spec.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
      
      {showModal && selectedSpeciality && (
        <SpecialistDetailsModal 
            speciality={selectedSpeciality}
            onClose={() => { setShowModal(false); setSelectedSpeciality(null); }}
        />
      )}
    </section>
  );
}
