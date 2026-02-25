import { motion } from 'framer-motion';
import { FiHeart, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-lg">H</span>
              </div>
              <span className="font-poppins font-bold text-xl text-white">HealthCare</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Smart Healthcare Management System — connecting patients with the best hospitals and doctors across India.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-poppins font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#hospitals" className="hover:text-primary-400 transition-colors">Hospitals</a></li>
              <li><a href="#doctors" className="hover:text-primary-400 transition-colors">Doctors</a></li>
              <li><a href="#specialities" className="hover:text-primary-400 transition-colors">Specialities</a></li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-poppins font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Online Booking</li>
              <li>Real-time Tracking</li>
              <li>Expert Consultation</li>
              <li>24/7 Emergency</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="font-poppins font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><FiPhone size={14} className="text-primary-400" /> +91 1234 567 890</li>
              <li className="flex items-center gap-2"><FiMail size={14} className="text-primary-400" /> support@healthcare.com</li>
              <li className="flex items-center gap-2"><FiMapPin size={14} className="text-primary-400" /> India</li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Made with <FiHeart className="text-red-400" size={14} /> Smart Healthcare Management System © 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
