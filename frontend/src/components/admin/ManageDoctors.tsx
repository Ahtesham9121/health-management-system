import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiImage, FiAward, FiStar } from 'react-icons/fi';
import { doctorAPI, hospitalAPI } from '../../services/api';

interface Doctor {
  id: number;
  name: string;
  degree: string;
  specialization: string;
  experienceYears: number;
  hospitalId: number;
  hospitalName: string;
  imageUrl: string;
  rating: number;
  pastExperience: string;
  degreeCompletionDate: string;
}

interface Hospital {
  id: number;
  name: string;
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    specialization: '',
    experienceYears: 1,
    hospitalId: '',
    imageUrl: '',
    rating: 5.0,
    pastExperience: '',
    degreeCompletionDate: ''
  });

  const fetchData = async () => {
    try {
      const doctorsRes = await doctorAPI.getAll({ page: 0, size: 200 });
      const hospitalsRes = await hospitalAPI.getAll({ page: 0, size: 200 });
      setDoctors(doctorsRes.data.content || []);
      setHospitals(hospitalsRes.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        degree: doctor.degree,
        specialization: doctor.specialization,
        experienceYears: doctor.experienceYears,
        hospitalId: doctor.hospitalId.toString(),
        imageUrl: doctor.imageUrl || '',
        rating: doctor.rating || 5.0,
        pastExperience: doctor.pastExperience || '',
        degreeCompletionDate: doctor.degreeCompletionDate || ''
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        degree: '',
        specialization: '',
        experienceYears: 1,
        hospitalId: hospitals[0]?.id.toString() || '',
        imageUrl: '',
        rating: 5.0,
        pastExperience: '',
        degreeCompletionDate: new Date().toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      hospitalId: Number(formData.hospitalId),
      experienceYears: Number(formData.experienceYears),
      rating: Number(formData.rating)
    };

    try {
      if (editingDoctor) {
        await doctorAPI.update(editingDoctor.id, payload);
      } else {
        await doctorAPI.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="input-field !pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center justify-center gap-2 !py-2 !px-6">
          <FiPlus /> Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="glass-card h-64 animate-pulse rounded-2xl" />)
        ) : (
          filteredDoctors.map((doctor) => (
            <motion.div key={doctor.id} layout className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center flex-1 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-primary-500/30">
                    <img src={doctor.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <h4 className="font-poppins font-semibold text-white truncate w-full">{doctor.name}</h4>
                  <p className="text-primary-400 text-xs font-medium">{doctor.specialization}</p>
                  <p className="text-gray-500 text-[10px] mt-1 italic">{doctor.hospitalName}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => handleOpenModal(doctor)} className="p-1.5 hover:bg-white/10 rounded-lg text-primary-400 transition-colors">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(doctor.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-around pt-3 border-t border-white/5">
                <div className="text-center">
                    <p className="text-[10px] text-gray-400">Exp</p>
                    <p className="text-xs font-bold text-white">{doctor.experienceYears}y</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400">Rating</p>
                    <p className="text-xs font-bold text-yellow-500 flex items-center gap-1 justify-center">
                        {doctor.rating} <FiStar size={10} className="fill-yellow-500" />
                    </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card w-full max-w-lg p-6 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-poppins font-bold text-white">
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Doctor Name</label>
                  <input type="text" className="input-field" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Degree</label>
                    <input type="text" className="input-field" required placeholder="MBBS, MD..."
                      value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Specialization</label>
                    <input type="text" className="input-field" required placeholder="Cardiology..."
                      value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Exp (Years)</label>
                    <input type="number" className="input-field" required min="1"
                      value={formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Rating</label>
                    <input type="number" step="0.1" max="5" min="1" className="input-field" required
                      value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Hospital</label>
                  <select className="select-field" required value={formData.hospitalId} 
                    onChange={e => setFormData({ ...formData, hospitalId: e.target.value })}>
                    {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Image URL</label>
                  <input type="url" className="input-field font-mono text-xs"
                    value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Degree Date</label>
                  <input type="date" className="input-field"
                    value={formData.degreeCompletionDate} onChange={e => setFormData({ ...formData, degreeCompletionDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Past Work / Biography</label>
                  <textarea className="input-field min-h-[80px]" rows={3}
                    value={formData.pastExperience} onChange={e => setFormData({ ...formData, pastExperience: e.target.value })} />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingDoctor ? 'Update Doctor' : 'Save Doctor'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
