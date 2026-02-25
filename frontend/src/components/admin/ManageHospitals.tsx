import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck, FiImage } from 'react-icons/fi';
import { hospitalAPI } from '../../services/api';

interface Hospital {
  id: number;
  name: string;
  state: string;
  city: string;
  type: string;
  imageUrl: string;
  emergency24x7: boolean;
  insuranceSupported: boolean;
}

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    type: 'Private',
    imageUrl: '',
    emergency24x7: false,
    insuranceSupported: false
  });

  const fetchHospitals = async () => {
    try {
      const res = await hospitalAPI.getAll({ page: 0, size: 100 });
      setHospitals(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleOpenModal = (hospital?: Hospital) => {
    if (hospital) {
      setEditingHospital(hospital);
      setFormData({
        name: hospital.name,
        state: hospital.state,
        city: hospital.city,
        type: hospital.type,
        imageUrl: hospital.imageUrl || '',
        emergency24x7: hospital.emergency24x7,
        insuranceSupported: hospital.insuranceSupported
      });
    } else {
      setEditingHospital(null);
      setFormData({
        name: '',
        state: '',
        city: '',
        type: 'Private',
        imageUrl: '',
        emergency24x7: false,
        insuranceSupported: false
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHospital) {
        await hospitalAPI.update(editingHospital.id, formData);
      } else {
        await hospitalAPI.create(formData);
      }
      setShowModal(false);
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      try {
        await hospitalAPI.delete(id);
        fetchHospitals();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search hospitals..."
            className="input-field !pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center justify-center gap-2 !py-2 !px-6">
          <FiPlus /> Add Hospital
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="glass-card h-48 animate-pulse rounded-2xl" />)
        ) : (
          filteredHospitals.map((hospital) => (
            <motion.div key={hospital.id} layout className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5">
                    <img src={hospital.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-white">{hospital.name}</h4>
                    <p className="text-xs text-gray-400">{hospital.city}, {hospital.state}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(hospital)} className="p-2 hover:bg-white/10 rounded-lg text-primary-400 transition-colors">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(hospital.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
                  {hospital.type}
                </span>
                {hospital.emergency24x7 && (
                  <span className="px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 text-[10px]">24x7</span>
                )}
                {hospital.insuranceSupported && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-[10px]">Insurance</span>
                )}
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
                  {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Hospital Name</label>
                  <input type="text" className="input-field" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">State</label>
                    <input type="text" className="input-field" required
                      value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">City</label>
                    <input type="text" className="input-field" required
                      value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Type</label>
                  <select className="select-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Image URL</label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="url" className="input-field !pl-10" placeholder="https://..."
                      value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border ${formData.emergency24x7 ? 'bg-primary-500 border-primary-500' : 'border-white/20'} flex items-center justify-center transition-colors group-hover:border-primary-400`}>
                      <input type="checkbox" className="hidden" checked={formData.emergency24x7}
                        onChange={e => setFormData({ ...formData, emergency24x7: e.target.checked })} />
                      {formData.emergency24x7 && <FiCheck size={14} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-300">24x7 Emergency</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border ${formData.insuranceSupported ? 'bg-primary-500 border-primary-500' : 'border-white/20'} flex items-center justify-center transition-colors group-hover:border-primary-400`}>
                      <input type="checkbox" className="hidden" checked={formData.insuranceSupported}
                        onChange={e => setFormData({ ...formData, insuranceSupported: e.target.checked })} />
                      {formData.insuranceSupported && <FiCheck size={14} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-300">Insurance Support</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingHospital ? 'Update Hospital' : 'Save Hospital'}
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
