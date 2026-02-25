import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiActivity, FiTool, FiCheckCircle } from 'react-icons/fi';
import * as Icons from 'react-icons/fi';

interface Speciality {
  id: number;
  name: string;
  description: string;
  iconName: string;
  symptoms?: string;
  cures?: string;
  medicalTools?: string;
}

interface SpecialistDetailsModalProps {
  speciality: Speciality | null;
  onClose: () => void;
}

// Helper to safely get icon
const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = Icons[iconName] || Icons.FiActivity; // Default to Activity if not found
    // In a real app we might want a better mapping, but using Fi icons for now or a switch
    return <FiActivity size={32} />;
};


export default function SpecialistDetailsModal({ speciality, onClose }: SpecialistDetailsModalProps) {
  if (!speciality) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl p-6 glass-card relative overflow-hidden"
        >
             <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary-500/20 to-accent-500/20" />
            
            <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
            <FiX size={24} className="text-white" />
            </button>

            <div className="relative pt-6">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30">
                         {/* We'll use a generic icon for now as dynamic icon mapping needs work, or pass icon component */}
                         <FiActivity size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold gradient-text">{speciality.name}</h2>
                        <p className="text-gray-400">{speciality.description}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {/* Symptoms */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-3 text-red-400">
                             <FiActivity />
                             <h3 className="font-semibold uppercase tracking-wider text-sm">Symptoms</h3>
                        </div>
                         <p className="text-gray-300 leading-relaxed">
                            {speciality.symptoms || 'General discomfort related to this field.'}
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cures */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-3 text-green-400">
                                <FiCheckCircle />
                                <h3 className="font-semibold uppercase tracking-wider text-sm">Treatments & Cures</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {speciality.cures || 'Standard medical treatments available.'}
                            </p>
                        </div>

                         {/* Tools */}
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-3 text-blue-400">
                                <FiTool />
                                <h3 className="font-semibold uppercase tracking-wider text-sm">Medical Tools</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {speciality.medicalTools || 'Advanced diagnostic equipment.'}
                            </p>
                        </div>
                    </div>
                 </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
