package com.healthcare.service;

import com.healthcare.dto.DoctorDTO;
import com.healthcare.entity.Doctor;
import com.healthcare.entity.Hospital;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final com.healthcare.websocket.WebSocketService webSocketService;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream().map(this::toDTO).toList();
    }

    public Page<DoctorDTO> getDoctors(Long hospitalId, String specialization, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (hospitalId != null) {
            return doctorRepository.findByHospitalId(hospitalId, pageable).map(this::toDTO);
        }
        if (specialization != null && !specialization.isEmpty()) {
            return doctorRepository.findBySpecialization(specialization, pageable).map(this::toDTO);
        }
        return doctorRepository.findAll(pageable).map(this::toDTO);
    }

    public List<DoctorDTO> getDoctorsByHospital(Long hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId).stream().map(this::toDTO).toList();
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return toDTO(doctor);
    }

    public DoctorDTO createDoctor(DoctorDTO dto) {
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + dto.getHospitalId()));

        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .degree(dto.getDegree())
                .specialization(dto.getSpecialization())
                .experienceYears(dto.getExperienceYears())
                .hospital(hospital)
                .imageUrl(dto.getImageUrl())
                .rating(dto.getRating())
                .pastExperience(dto.getPastExperience())
                .degreeCompletionDate(dto.getDegreeCompletionDate())
                .build();
        doctor = doctorRepository.save(doctor);
        webSocketService.broadcastDashboardUpdate();
        return toDTO(doctor);
    }

    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (dto.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Hospital not found with id: " + dto.getHospitalId()));
            doctor.setHospital(hospital);
        }

        if (dto.getName() != null)
            doctor.setName(dto.getName());
        if (dto.getDegree() != null)
            doctor.setDegree(dto.getDegree());
        if (dto.getSpecialization() != null)
            doctor.setSpecialization(dto.getSpecialization());
        if (dto.getExperienceYears() != null)
            doctor.setExperienceYears(dto.getExperienceYears());
        if (dto.getImageUrl() != null)
            doctor.setImageUrl(dto.getImageUrl());
        if (dto.getRating() != null)
            doctor.setRating(dto.getRating());
        if (dto.getPastExperience() != null)
            doctor.setPastExperience(dto.getPastExperience());
        if (dto.getDegreeCompletionDate() != null)
            doctor.setDegreeCompletionDate(dto.getDegreeCompletionDate());

        doctor = doctorRepository.save(doctor);
        webSocketService.broadcastDashboardUpdate();
        return toDTO(doctor);
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
        webSocketService.broadcastDashboardUpdate();
    }

    private DoctorDTO toDTO(Doctor d) {
        return DoctorDTO.builder()
                .id(d.getId())
                .name(d.getName())
                .degree(d.getDegree())
                .specialization(d.getSpecialization())
                .experienceYears(d.getExperienceYears())
                .hospitalId(d.getHospital() != null ? d.getHospital().getId() : null)
                .hospitalName(d.getHospital() != null ? d.getHospital().getName() : null)
                .imageUrl(d.getImageUrl())
                .rating(d.getRating())
                .pastExperience(d.getPastExperience())
                .degreeCompletionDate(d.getDegreeCompletionDate())
                .build();
    }
}
