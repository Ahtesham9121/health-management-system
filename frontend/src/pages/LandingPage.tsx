import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HospitalsSection from '../components/HospitalsSection';
import DoctorsSection from '../components/DoctorsSection';
import SpecialitiesSection from '../components/SpecialitiesSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-healthcare-dark">
      <Navbar />
      <HeroSection />
      <HospitalsSection />
      <DoctorsSection />
      <SpecialitiesSection />
      <Footer />
    </div>
  );
}
