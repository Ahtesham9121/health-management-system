package com.healthcare.service;

import com.healthcare.dto.DashboardStats;
import com.healthcare.entity.Appointment;
import com.healthcare.entity.User;
import com.healthcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats() {
        return DashboardStats.builder()
                .totalHospitals(hospitalRepository.count())
                .totalDoctors(doctorRepository.count())
                .totalAppointments(appointmentRepository.count())
                .bookedAppointments(appointmentRepository.countByStatus(Appointment.Status.BOOKED))
                .completedAppointments(appointmentRepository.countByStatus(Appointment.Status.COMPLETED))
                .cancelledAppointments(appointmentRepository.countByStatus(Appointment.Status.CANCELLED))
                .totalPatients(userRepository.count())
                .build();
    }
}
