import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiDownload, FiUser, FiPhone, FiInfo } from 'react-icons/fi';
import { locationAPI, hospitalAPI, doctorAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Doctor {
  id: number;
  name: string;
  degree?: string;
  specialization: string;
  experienceYears?: number;
  hospitalId: number;
  hospitalName: string;
  imageUrl?: string;
}

interface Hospital {
    id: number;
    name: string;
    city: string;
    state: string;
}

interface AppointmentModalProps {
  doctor?: Doctor;
  hospital?: Hospital;
  onClose: () => void;
}

export default function AppointmentModal({ doctor, hospital, onClose }: AppointmentModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(doctor ? 3 : (hospital ? 2 : 1));
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [hospitals, setHospitals] = useState<{ id: number; name: string; city: string }[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    stateId: '',
    stateName: hospital?.state || '',
    cityName: hospital?.city || '',
    hospitalId: doctor?.hospitalId?.toString() || hospital?.id?.toString() || '',
    hospitalName: doctor?.hospitalName || hospital?.name || '',
    doctorId: doctor?.id?.toString() || '',
    doctorName: doctor?.name || '',
    appointmentDate: '',
    appointmentTime: '',
    // Patient Profile Fields
    patientName: user?.name || '',
    dob: '',
    gender: 'Male',
    mobileNumber: '',
    age: '',
    lastAppointment: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ trackingId: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hospital) {
         doctorAPI.getByHospital(hospital.id)
            .then(res => setDoctors(res.data))
            .catch(() => {});
    }
  }, [hospital]);

  useEffect(() => {
    locationAPI.getStates().then(res => setStates(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.stateId) {
      locationAPI.getCities(Number(form.stateId)).then(res => setCities(res.data)).catch(() => {});
    }
  }, [form.stateId]);

  useEffect(() => {
    if (form.cityName && !hospital) {
      hospitalAPI.getAll({ city: form.cityName, page: 0, size: 50 })
        .then(res => setHospitals(res.data.content || []))
        .catch(() => {});
    }
  }, [form.cityName, hospital]);

  useEffect(() => {
    if (form.hospitalId) {
      doctorAPI.getByHospital(Number(form.hospitalId))
        .then(res => setDoctors(res.data))
        .catch(() => {});
    }
  }, [form.hospitalId]);

  const handleSubmit = async () => {
    if (!form.doctorId || !form.hospitalId || !form.appointmentDate || !form.appointmentTime || !form.patientName || !form.mobileNumber) {
      setError('Please fill all required fields');
      setStep(4);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await appointmentAPI.book({
        doctorId: Number(form.doctorId),
        hospitalId: Number(form.hospitalId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        patientName: form.patientName,
        dob: form.dob,
        gender: form.gender,
        mobileNumber: form.mobileNumber,
        age: form.age ? Number(form.age) : undefined,
        lastAppointment: form.lastAppointment
      });
      setSuccess({ trackingId: res.data.trackingId });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
      if (!success) return;
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Smart Healthcare System", 105, 20, { align: "center" });
      
      doc.setFontSize(16);
      doc.text("Appointment Receipt", 105, 30, { align: "center" });
      
      const data = [
          ["Tracking ID", success.trackingId],
          ["Patient Name", form.patientName],
          ["DOB", form.dob || 'N/A'],
          ["Gender", form.gender],
          ["Mobile", form.mobileNumber],
          ["Age", form.age || 'N/A'],
          ["Last Appointment", form.lastAppointment || 'N/A'],
          ["Doctor", form.doctorName],
          ["Hospital", form.hospitalName],
          ["Date", form.appointmentDate],
          ["Time", form.appointmentTime],
          ["Status", "Confirmed"]
      ];
      
      autoTable(doc, {
          startY: 40,
          head: [['Field', 'Details']],
          body: data,
          theme: 'grid',
          headStyles: { fillColor: [66, 133, 244] },
      });
      
      doc.setFontSize(10);
      doc.text("Thank you for using Smart Healthcare System.", 105, (doc as any).lastAutoTable.finalY + 20, { align: "center" });
      
      doc.save(`Appointment_${success.trackingId}.pdf`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
          className="glass-card w-full max-w-lg p-6 md:p-8 rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto">

          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-500/20 flex items-center justify-center">
                <FiCheckCircle size={40} className="text-accent-400" />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-white mb-2">Appointment Booked!</h3>
              <p className="text-gray-400 mb-6">Your appointment has been successfully scheduled.</p>
              <div className="glass-card p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-400 mb-1">Tracking ID</p>
                <p className="text-xl font-poppins font-bold gradient-text">{success.trackingId}</p>
              </div>
              
              <button onClick={generatePDF} className="btn-secondary w-full mb-3 flex items-center justify-center gap-2">
                <FiDownload /> Download Receipt
              </button>
              
              <button onClick={onClose} className="btn-primary w-full">Done</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-poppins font-bold text-white">Book Appointment</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <FiX size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-8">
                {['Location', 'Hospital', 'Schedule', 'Patient'].map((label, i) => {
                  const stepNum = i + 1;
                  const isActive = doctor ? stepNum >= 3 && step >= stepNum : (hospital ? (stepNum >= 2 && step >= stepNum) : step >= stepNum);
                  return (
                    <div key={label} className="flex-1 text-center">
                      <div className={`h-1.5 rounded-full transition-all ${isActive ? 'bg-primary-500 shadow-glow' : 'bg-white/10'}`} />
                      <p className={`text-[10px] sm:text-xs mt-1.5 font-medium ${isActive ? 'text-primary-400' : 'text-gray-500'}`}>{label}</p>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
              )}

              {!doctor && !hospital && step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      <FiMapPin className="inline mr-1" /> Select State
                    </label>
                    <select className="select-field" value={form.stateId} onChange={e => {
                      const state = states.find(s => s.id === Number(e.target.value));
                      setForm(f => ({ ...f, stateId: e.target.value, stateName: state?.name || '', cityName: '', hospitalId: '', doctorId: '' }));
                    }}>
                      <option value="">Choose a state</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Select City</label>
                    <select className="select-field" value={form.cityName} onChange={e => {
                      setForm(f => ({ ...f, cityName: e.target.value, hospitalId: '', doctorId: '' }));
                    }} disabled={!form.stateId}>
                      <option value="">Choose a city</option>
                      {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <button onClick={() => setStep(2)} disabled={!form.cityName} className="btn-primary w-full mt-4">
                    Continue
                  </button>
                </div>
              )}

              {!doctor && step === 2 && (
                <div className="space-y-4">
                  {hospital ? (
                      <div className="glass-card p-4 rounded-xl mb-4">
                          <p className="text-sm text-gray-400">Hospital</p>
                          <p className="text-white font-medium">{hospital.name}</p>
                          <p className="text-primary-400 text-sm">{hospital.city}, {hospital.state}</p>
                      </div>
                  ) : (
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Select Hospital</label>
                        <select className="select-field" value={form.hospitalId} onChange={e => {
                        const hosp = hospitals.find(h => h.id === Number(e.target.value));
                        setForm(f => ({ ...f, hospitalId: e.target.value, hospitalName: hosp?.name || '', doctorId: '' }));
                        }}>
                        <option value="">Choose a hospital</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Select Doctor</label>
                    <select className="select-field" value={form.doctorId} onChange={e => {
                      const doc = doctors.find(d => d.id === Number(e.target.value));
                      setForm(f => ({ ...f, doctorId: e.target.value, doctorName: doc?.name || '' }));
                    }} disabled={!form.hospitalId}>
                      <option value="">Choose a doctor</option>
                      {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-4">
                    {!hospital && <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>}
                    <button onClick={() => setStep(3)} disabled={!form.doctorId} className="btn-primary flex-1">Continue</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-xl mb-4">
                    <p className="text-sm text-gray-400">Booking with</p>
                    <p className="text-white font-medium">{form.doctorName || doctor?.name}</p>
                    <p className="text-primary-400 text-sm">{form.hospitalName || hospital?.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      <FiCalendar className="inline mr-1" /> Appointment Date
                    </label>
                    <input type="date" className="input-field" min={minDate}
                      value={form.appointmentDate} onChange={e => setForm(f => ({ ...f, appointmentDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      <FiClock className="inline mr-1" /> Appointment Time
                    </label>
                    <input type="time" className="input-field"
                      value={form.appointmentTime} onChange={e => setForm(f => ({ ...f, appointmentTime: e.target.value }))} />
                  </div>
                  <div className="flex gap-3 mt-4">
                    {!doctor && <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>}
                    <button onClick={() => setStep(4)} disabled={!form.appointmentDate || !form.appointmentTime} className="btn-primary flex-1">Next: Patient Info</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1"><FiUser className="inline mr-1" /> Full Name</label>
                            <input type="text" className="input-field" value={form.patientName} 
                                onChange={e => setForm({...form, patientName: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1"><FiPhone className="inline mr-1" /> Mobile</label>
                            <input type="tel" className="input-field" value={form.mobileNumber} 
                                onChange={e => setForm({...form, mobileNumber: e.target.value})} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Date of Birth</label>
                            <input type="date" className="input-field" value={form.dob} 
                                onChange={e => setForm({...form, dob: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Age</label>
                            <input type="number" className="input-field" value={form.age} 
                                onChange={e => setForm({...form, age: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Gender</label>
                        <select className="select-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1"><FiInfo className="inline mr-1" /> Last Appointment Date</label>
                        <input type="date" className="input-field" value={form.lastAppointment} 
                            onChange={e => setForm({...form, lastAppointment: e.target.value})} />
                        <p className="text-[10px] text-gray-500 mt-1 italic">Enter the date of your previous medical visit, if any.</p>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
                        <button onClick={handleSubmit} disabled={loading} className="btn-accent flex-1">
                            {loading ? 'Processing...' : 'Confirm & Book'}
                        </button>
                    </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

