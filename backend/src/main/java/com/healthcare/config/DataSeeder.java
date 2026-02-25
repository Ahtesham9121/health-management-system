package com.healthcare.config;

import com.healthcare.entity.*;
import com.healthcare.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final StateRepository stateRepository;
        private final CityRepository cityRepository;
        private final HospitalRepository hospitalRepository;
        private final DoctorRepository doctorRepository;
        private final SpecialityRepository specialityRepository;
        private final UserRepository userRepository;
        private final AppointmentRepository appointmentRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                if (userRepository.count() > 0) {
                        log.info("Database already contains data, skipping seeding.");
                        return;
                }

                log.info("Seeding database...");

                // Seed Specialities
                List<Speciality> specialities = List.of(
                                Speciality.builder().name("Cardiology")
                                                .description("Heart and cardiovascular system specialists")
                                                .iconName("heart")
                                                .symptoms("Chest pain, Shortness of breath, Palpitations, Dizziness")
                                                .cures("Angioplasty, Heart Bypass Surgery, Pacemaker Implantation, Medication")
                                                .medicalTools("ECG Machine, Echocardiogram, Angiogram setup")
                                                .build(),
                                Speciality.builder().name("Dermatology")
                                                .description("Skin, hair, and nail specialists")
                                                .iconName("skin")
                                                .symptoms("Acne, Skin Rashes, Hair Loss, Eczema")
                                                .cures("Laser Therapy, Chemical Peels, Topical Medications, Biopsy")
                                                .medicalTools("Dermatoscope, Cryotherapy Unit, Laser Equipment")
                                                .build(),
                                Speciality.builder().name("Neurology")
                                                .description("Brain and nervous system specialists")
                                                .iconName("brain")
                                                .symptoms("Headaches, Seizures, Numbness, Memory Loss")
                                                .cures("Brain Surgery, Spinal Surgery, Medication, Physical Therapy")
                                                .medicalTools("MRI Machine, CT Scanner, EEG Machine")
                                                .build(),
                                Speciality.builder().name("Orthopedics")
                                                .description("Bone, joint, and muscle specialists")
                                                .iconName("bone")
                                                .symptoms("Joint Pain, Fractures, Back Pain, Arthritis")
                                                .cures("Joint Replacement, Arthroscopy, Casts/Splints, Physiotherapy")
                                                .medicalTools("X-Ray Machine, Arthropump, Orthopedic Drills")
                                                .build(),
                                Speciality.builder().name("Pediatrics")
                                                .description("Child healthcare specialists")
                                                .iconName("child")
                                                .symptoms("Fevers, Infections, Growth Issues, Developmental Delays")
                                                .cures("Vaccinations, antibiotics, Nutritional Counseling, Surgery")
                                                .medicalTools("Stethoscope, Otoscope, Growth Charts")
                                                .build(),
                                Speciality.builder().name("Ophthalmology")
                                                .description("Eye care specialists")
                                                .iconName("eye")
                                                .symptoms("Blurred Vision, Eye Pain, Redness, Cataracts")
                                                .cures("LASIK Surgery, Cataract Surgery, Lens Implants, Glasses/Contacts")
                                                .medicalTools("Slit Lamp, Phoropter, Ophthalmoscope")
                                                .build(),
                                Speciality.builder().name("ENT")
                                                .description("Ear, nose, and throat specialists")
                                                .iconName("ear")
                                                .symptoms("Ear infections, Sinusitis, Sore Throat, Hearing Loss")
                                                .cures("Tonsillectomy, Sinus Surgery, Hearing Aids, Medication")
                                                .medicalTools("Otoscope, Laryngoscope, Audiometer")
                                                .build(),
                                Speciality.builder().name("Gastroenterology")
                                                .description("Digestive system specialists")
                                                .iconName("stomach")
                                                .symptoms("Stomach Pain, Heartburn, Indigestion, Ulcers")
                                                .cures("Endoscopy, Colonoscopy, Medication, Diet Changes")
                                                .medicalTools("Endoscope, Colonoscope, Ultrasound")
                                                .build(),
                                Speciality.builder().name("Pulmonology")
                                                .description("Lung and respiratory system specialists")
                                                .iconName("lungs")
                                                .symptoms("Coughing, Wheezing, Shortness of Breath, Asthma")
                                                .cures("Inhalers, Oxygen Therapy, Pulmonary Rehab, Surgery")
                                                .medicalTools("Spirometer, Bronchoscope, Pulse Oximeter")
                                                .build(),
                                Speciality.builder().name("Oncology")
                                                .description("Cancer treatment specialists")
                                                .iconName("ribbon")
                                                .symptoms("Unexplained Weight Loss, Lumps, Fatigue, Pain")
                                                .cures("Chemotherapy, Radiation Therapy, Immunotherapy, Surgery")
                                                .medicalTools("PET Scanner, Linear Accelerator, Infusion Pumps")
                                                .build(),
                                Speciality.builder().name("Psychiatry")
                                                .description("Mental health specialists")
                                                .iconName("mind")
                                                .symptoms("Anxiety, Depression, Mood Swings, Insomnia")
                                                .cures("Psychotherapy, Medication (Antidepressants), counseling")
                                                .medicalTools("Psychological Testing Kits, Biofeedback Devices")
                                                .build(),
                                Speciality.builder().name("General Medicine")
                                                .description("General healthcare and primary care")
                                                .iconName("stethoscope")
                                                .symptoms("Fever, Fatigue, Body Ache, Common Cold")
                                                .cures("Antibiotics, Antivirals, Lifestyle Advice, Referrals")
                                                .medicalTools("Thermometer, BP Monitor, Stethoscope")
                                                .build());
                specialityRepository.saveAll(specialities);

                // Seed States and Cities
                Map<String, List<String>> statesAndCities = new LinkedHashMap<>();
                statesAndCities.put("Maharashtra", List.of("Mumbai", "Pune", "Nagpur", "Nashik"));
                statesAndCities.put("Delhi", List.of("New Delhi", "Dwarka", "Rohini"));
                statesAndCities.put("Karnataka", List.of("Bangalore", "Mysore", "Mangalore"));
                statesAndCities.put("Tamil Nadu", List.of("Chennai", "Coimbatore", "Madurai"));
                statesAndCities.put("Uttar Pradesh", List.of("Lucknow", "Noida", "Varanasi"));
                statesAndCities.put("Gujarat", List.of("Ahmedabad", "Surat", "Vadodara"));
                statesAndCities.put("Rajasthan", List.of("Jaipur", "Udaipur", "Jodhpur"));
                statesAndCities.put("West Bengal", List.of("Kolkata", "Howrah", "Siliguri"));
                statesAndCities.put("Telangana", List.of("Hyderabad", "Warangal", "Nizamabad"));
                statesAndCities.put("Kerala", List.of("Kochi", "Thiruvananthapuram", "Kozhikode"));

                Map<String, State> stateMap = new HashMap<>();
                Map<String, City> cityMap = new HashMap<>();

                for (Map.Entry<String, List<String>> entry : statesAndCities.entrySet()) {
                        State state = stateRepository.save(State.builder().name(entry.getKey()).build());
                        stateMap.put(entry.getKey(), state);
                        for (String cityName : entry.getValue()) {
                                City city = cityRepository.save(City.builder().name(cityName).state(state).build());
                                cityMap.put(cityName, city);
                        }
                }

                // Seed Hospitals
                List<Hospital> hospitals = List.of(
                                Hospital.builder().name("Apollo Hospital").state("Maharashtra").city("Mumbai")
                                                .type("Private")
                                                .rating(new BigDecimal("4.5")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600")
                                                .build(),
                                Hospital.builder().name("Fortis Healthcare").state("Delhi").city("New Delhi")
                                                .type("Private")
                                                .rating(new BigDecimal("4.3")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600")
                                                .build(),
                                Hospital.builder().name("AIIMS Delhi").state("Delhi").city("New Delhi")
                                                .type("Government")
                                                .rating(new BigDecimal("4.8")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600")
                                                .build(),
                                Hospital.builder().name("Manipal Hospital").state("Karnataka").city("Bangalore")
                                                .type("Private")
                                                .rating(new BigDecimal("4.4")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600")
                                                .build(),
                                Hospital.builder().name("Christian Medical College").state("Tamil Nadu").city("Chennai")
                                                .type("Private")
                                                .rating(new BigDecimal("4.6")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1551076805-e1869033e561?w=600")
                                                .build(),
                                Hospital.builder().name("King George's Medical University").state("Uttar Pradesh")
                                                .city("Lucknow")
                                                .type("Government").rating(new BigDecimal("4.2")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600")
                                                .build(),
                                Hospital.builder().name("Kokilaben Hospital").state("Maharashtra").city("Mumbai")
                                                .type("Private")
                                                .rating(new BigDecimal("4.7")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600")
                                                .build(),
                                Hospital.builder().name("Narayana Health").state("Karnataka").city("Bangalore")
                                                .type("Private")
                                                .rating(new BigDecimal("4.5")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1580281657702-257584239a55?w=600")
                                                .build(),
                                Hospital.builder().name("Medanta Hospital").state("Delhi").city("Dwarka")
                                                .type("Private")
                                                .rating(new BigDecimal("4.6")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=600")
                                                .build(),
                                Hospital.builder().name("Ruby Hall Clinic").state("Maharashtra").city("Pune")
                                                .type("Private")
                                                .rating(new BigDecimal("4.3")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600")
                                                .build(),
                                Hospital.builder().name("Sanjay Gandhi Hospital").state("Uttar Pradesh").city("Lucknow")
                                                .type("Government").rating(new BigDecimal("4.1")).emergency24x7(true)
                                                .insuranceSupported(false)
                                                .imageUrl("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600")
                                                .build(),
                                Hospital.builder().name("Amrita Hospital").state("Kerala").city("Kochi").type("Private")
                                                .rating(new BigDecimal("4.5")).emergency24x7(true)
                                                .insuranceSupported(true)
                                                .imageUrl("https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600")
                                                .build());
                hospitalRepository.saveAll(hospitals);

                // Seed Doctors
                String[] doctorImages = {
                                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
                                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
                                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
                                "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400",
                                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
                                "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400"
                };

                List<Doctor> doctors = new ArrayList<>();
                String[][] doctorData = {
                                { "Dr. Rajesh Kumar", "MD, DM Cardiology", "Cardiology", "15", "4.8",
                                                "Senior Cardiovascular Surgeon at AIIMS for 10 years." },
                                { "Dr. Priya Sharma", "MBBS, MD Dermatology", "Dermatology", "12", "4.7",
                                                "Consultant Dermatologist at Fortis with expertise in cosmetic procedures." },
                                { "Dr. Amit Patel", "MS, MCh Neurosurgery", "Neurology", "20", "4.9",
                                                "Head of Neurosurgery at Apollo, specializing in minimally invasive spine surgery." },
                                { "Dr. Sneha Reddy", "MS Orthopedics", "Orthopedics", "10", "4.5",
                                                "Orthopedic Surgeon focusing on sports injuries and joint replacement." },
                                { "Dr. Vikram Singh", "MD Pediatrics", "Pediatrics", "18", "4.8",
                                                "Renowned Pediatrician with 15 years in child critical care." },
                                { "Dr. Anita Desai", "MS Ophthalmology", "Ophthalmology", "14", "4.6",
                                                "Eye Surgeon with over 5000 successful cataract surgeries." },
                                { "Dr. Suresh Nair", "MS ENT", "ENT", "16", "4.5",
                                                "ENT Specialist known for advanced sinus and ear surgeries." },
                                { "Dr. Meena Iyer", "DM Gastroenterology", "Gastroenterology", "11", "4.7",
                                                "Expert in endoscopic procedures and liver diseases." },
                                { "Dr. Rahul Mehta", "DM Pulmonology", "Pulmonology", "13", "4.6",
                                                "Pulmonologist specializing in asthma, COPD, and sleep apnea." },
                                { "Dr. Kavita Joshi", "DM Oncology", "Oncology", "22", "4.9",
                                                "Senior Oncologist with extensive experience in chemotherapy and immunotherapy." },
                                { "Dr. Arjun Menon", "MD Psychiatry", "Psychiatry", "9", "4.4",
                                                "Psychiatrist focusing on anxiety disorders and cognitive behavioral therapy." },
                                { "Dr. Deepika Gupta", "MBBS, MD", "General Medicine", "8", "4.3",
                                                "Primary Care Physician dedicated to preventive healthcare." },
                                { "Dr. Sanjay Verma", "MD, DM Cardiology", "Cardiology", "25", "5.0",
                                                "Chief Cardiologist, pioneer in pediatric heart surgery in the region." },
                                { "Dr. Nisha Kapoor", "MBBS, MD Dermatology", "Dermatology", "7", "4.2",
                                                "Dermatologist with a focus on pediatric skin conditions." },
                                { "Dr. Manoj Tiwari", "MS, MCh Neurosurgery", "Neurology", "19", "4.8",
                                                "Neurosurgeon with expertise in brain tumor removal and stroke management." },
                                { "Dr. Pooja Agarwal", "MS Orthopedics", "Orthopedics", "11", "4.5",
                                                "Orthopedic specialist in hand and upper extremity surgery." },
                                { "Dr. Rohit Khanna", "MD Pediatrics", "Pediatrics", "14", "4.7",
                                                "Pediatrician with special interest in neonatology." },
                                { "Dr. Swati Mishra", "DM Gastroenterology", "Gastroenterology", "16", "4.6",
                                                "Gastroenterologist specializing in inflammatory bowel diseases." },
                                { "Dr. Ashok Banerjee", "DM Pulmonology", "Pulmonology", "21", "4.9",
                                                "Pulmonologist and Critical Care specialist." },
                                { "Dr. Lakshmi Pillai", "MD, DM Cardiology", "Cardiology", "17", "4.8",
                                                "Interventional Cardiologist with high success rate in angioplasty." }
                };

                for (int i = 0; i < doctorData.length; i++) {
                        Hospital hospital = hospitals.get(i % hospitals.size());
                        int expYears = Integer.parseInt(doctorData[i][3]);
                        doctors.add(Doctor.builder()
                                        .name(doctorData[i][0])
                                        .degree(doctorData[i][1])
                                        .specialization(doctorData[i][2])
                                        .experienceYears(expYears)
                                        .hospital(hospital)
                                        .imageUrl(doctorImages[i % doctorImages.length])
                                        .rating(new BigDecimal(doctorData[i][4]))
                                        .pastExperience(doctorData[i][5])
                                        .degreeCompletionDate(LocalDate.now().minusYears(expYears + 5)) // Approx logic
                                        .build());
                }
                doctorRepository.saveAll(doctors);

                // Seed Admin User
                userRepository.save(User.builder()
                                .name("Admin")
                                .email("admin@healthcare.com")
                                .password(passwordEncoder.encode("admin123"))
                                .role(User.Role.ADMIN)
                                .build());

                log.info("Database seeding completed successfully!");
        }
}
