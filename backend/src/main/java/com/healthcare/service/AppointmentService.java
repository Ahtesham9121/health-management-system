package com.healthcare.service;

import com.healthcare.dto.AppointmentRequest;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.entity.*;
import com.healthcare.exception.BadRequestException;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.repository.*;
import com.healthcare.websocket.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;
    private final WebSocketService webSocketService;

    @Transactional
    public AppointmentResponse bookAppointment(Long userId, AppointmentRequest request) {
        System.out.println("DEBUG: Starting booking for userId: " + userId);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

            Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));

            // Update/Create Patient Profile
            Patient patient = patientRepository.findByUser(user)
                    .orElse(new Patient());

            patient.setUser(user);
            String pName = (request.getPatientName() != null && !request.getPatientName().trim().isEmpty())
                    ? request.getPatientName()
                    : user.getName();
            patient.setName(pName);

            if (request.getDob() != null && !request.getDob().trim().isEmpty()) {
                patient.setDob(parseDateRobustly(request.getDob()));
            }

            if (request.getGender() != null)
                patient.setGender(request.getGender());
            if (request.getMobileNumber() != null)
                patient.setMobileNumber(request.getMobileNumber());
            if (request.getAge() != null)
                patient.setAge(request.getAge());

            if (request.getLastAppointment() != null && !request.getLastAppointment().trim().isEmpty()) {
                LocalDate lastDate = parseDateRobustly(request.getLastAppointment());
                if (lastDate != null)
                    patient.setLastAppointment(lastDate.atStartOfDay());
            }

            System.out.println("DEBUG: Saving patient profile for: " + pName);
            patientRepository.save(patient);

            String trackingId = generateTrackingId();

            LocalDate appDate = parseDateRobustly(request.getAppointmentDate());
            LocalTime appTime;
            try {
                if (appDate == null)
                    throw new IllegalArgumentException("Date cannot be null");
                appTime = LocalTime.parse(request.getAppointmentTime());
            } catch (Exception e) {
                throw new BadRequestException("Invalid appointment date (" + request.getAppointmentDate()
                        + ") or time format (" + request.getAppointmentTime() + "): " + e.getMessage());
            }

            System.out.println("DEBUG: Creating appointment for date: " + appDate);
            Appointment appointment = Appointment.builder()
                    .trackingId(trackingId)
                    .patient(user)
                    .doctor(doctor)
                    .hospital(hospital)
                    .appointmentDate(appDate)
                    .appointmentTime(appTime)
                    .status(Appointment.Status.BOOKED)
                    .build();

            appointment = appointmentRepository.save(appointment);
            System.out.println("DEBUG: Appointment saved successfully with trackingId: " + trackingId);

            AppointmentResponse response = toResponse(appointment);
            webSocketService.broadcastAppointmentUpdate(response);
            webSocketService.broadcastDashboardUpdate();

            return response;
        } catch (BadRequestException | ResourceNotFoundException e) {
            System.out.println("DEBUG: Handled exception: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("DEBUG: UNEXPECTED ERROR during booking:");
            e.printStackTrace();
            throw new BadRequestException("Booking failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    private LocalDate parseDateRobustly(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty())
            return null;
        String[] formats = { "yyyy-MM-dd", "dd-MM-yyyy", "yyyy/MM/dd", "dd/MM/yyyy" };
        for (String format : formats) {
            try {
                return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(format));
            } catch (Exception ignored) {
            }
        }
        return null; // Or throw custom exception
    }

    public AppointmentResponse getByTrackingId(String trackingId) {
        Appointment appointment = appointmentRepository.findByTrackingId(trackingId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Appointment not found with tracking ID: " + trackingId));
        return toResponse(appointment);
    }

    public List<AppointmentResponse> getByPatientId(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream().map(this::toResponse).toList();
    }

    public List<AppointmentResponse> getRecentAppointments() {
        return appointmentRepository.findTop10ByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() == Appointment.Status.CANCELLED) {
            throw new BadRequestException("Appointment is already cancelled");
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        appointment = appointmentRepository.save(appointment);

        AppointmentResponse response = toResponse(appointment);
        webSocketService.broadcastAppointmentUpdate(response);
        webSocketService.broadcastDashboardUpdate();

        return response;
    }

    private String generateTrackingId() {
        Long maxId = appointmentRepository.findMaxId();
        long nextNum = (maxId != null ? maxId : 0) + 1;
        return String.format("HCMS-%d-%04d", Year.now().getValue(), nextNum);
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .trackingId(a.getTrackingId())
                .patientName(a.getPatient().getName())
                .doctorName(a.getDoctor().getName())
                .doctorSpecialization(a.getDoctor().getSpecialization())
                .hospitalName(a.getHospital().getName())
                .appointmentDate(a.getAppointmentDate().toString())
                .appointmentTime(a.getAppointmentTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .status(a.getStatus().name())
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
                .build();
    }
}
