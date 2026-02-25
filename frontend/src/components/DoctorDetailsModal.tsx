import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAward, FiStar, FiClock, FiCalendar, FiBriefcase } from 'react-icons/fi';

interface Doctor {
  id: number;
  name: string;
  degree: string;
  specialization: string;
  experienceYears: number;
  hospital?: {
      name: string;
      city: string;
  };
  imageUrl?: string;
  rating?: number;
  pastExperience?: string;
  degreeCompletionDate?: string;
}

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  onClose: () => void;
}

export default function DoctorDetailsModal({ doctor, onClose }: DoctorDetailsModalProps) {
  if (!doctor) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden glass-card relative"
        >
            <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
            <FiX size={24} className="text-white" />
            </button>

            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-auto relative">
                     <img 
                        src={doctor.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                    />
                     <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <FiStar className="text-yellow-500 fill-yellow-500" size={14} />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{doctor.rating || 'N/A'}</span>
                    </div>
                </div>
                
                <div className="p-6 md:w-2/3 space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold gradient-text">{doctor.name}</h2>
                        <p className="text-lg text-primary-400 font-medium">{doctor.specialization}</p>
                        <p className="text-gray-400 text-sm mt-1">{doctor.degree}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/5 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-primary-400 mb-1">
                                <FiBriefcase />
                                <span className="text-xs font-semibold uppercase tracking-wider">Experience</span>
                            </div>
                            <p className="text-white font-semibold">{doctor.experienceYears} Years</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-primary-400 mb-1">
                                <FiCalendar />
                                <span className="text-xs font-semibold uppercase tracking-wider">Degree Date</span>
                            </div>
                            <p className="text-white font-semibold">{doctor.degreeCompletionDate || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary-400">
                             <FiAward />
                             <span className="text-sm font-semibold uppercase tracking-wider">Past Experience</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {doctor.pastExperience || 'No past experience details available.'}
                        </p>
                    </div>

                     <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                             <div className='text-sm text-gray-400'>
                                Currently at: <span className="text-white font-medium">{doctor.hospital?.name}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
