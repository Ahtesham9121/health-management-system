package com.healthcare.service;

import com.healthcare.dto.HospitalDTO;
import com.healthcare.entity.Hospital;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final com.healthcare.websocket.WebSocketService webSocketService;

    public Page<HospitalDTO> getHospitals(String state, String city, String type,
            String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        if (search != null && !search.isEmpty()) {
            return hospitalRepository.searchHospitals(search, pageable).map(this::toDTO);
        }

        return hospitalRepository.findByFilters(
                state != null && !state.isEmpty() ? state : null,
                city != null && !city.isEmpty() ? city : null,
                type != null && !type.isEmpty() ? type : null,
                pageable).map(this::toDTO);
    }

    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll().stream().map(this::toDTO).toList();
    }

    public HospitalDTO getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        return toDTO(hospital);
    }

    public HospitalDTO createHospital(HospitalDTO dto) {
        Hospital hospital = Hospital.builder()
                .name(dto.getName())
                .state(dto.getState())
                .city(dto.getCity())
                .type(dto.getType())
                .rating(dto.getRating())
                .websiteUrl(dto.getWebsiteUrl())
                .emergency24x7(dto.getEmergency24x7())
                .insuranceSupported(dto.getInsuranceSupported())
                .imageUrl(dto.getImageUrl())
                .build();
        hospital = hospitalRepository.save(hospital);
        webSocketService.broadcastDashboardUpdate();
        return toDTO(hospital);
    }

    public HospitalDTO updateHospital(Long id, HospitalDTO dto) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        hospital.setName(dto.getName());
        hospital.setState(dto.getState());
        hospital.setCity(dto.getCity());
        hospital.setType(dto.getType());
        hospital.setRating(dto.getRating());
        hospital.setWebsiteUrl(dto.getWebsiteUrl());
        hospital.setEmergency24x7(dto.getEmergency24x7());
        hospital.setInsuranceSupported(dto.getInsuranceSupported());
        hospital.setImageUrl(dto.getImageUrl());
        hospital = hospitalRepository.save(hospital);
        webSocketService.broadcastDashboardUpdate();
        return toDTO(hospital);
    }

    public void deleteHospital(Long id) {
        if (!hospitalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hospital not found with id: " + id);
        }
        hospitalRepository.deleteById(id);
        webSocketService.broadcastDashboardUpdate();
    }

    private HospitalDTO toDTO(Hospital h) {
        return HospitalDTO.builder()
                .id(h.getId())
                .name(h.getName())
                .state(h.getState())
                .city(h.getCity())
                .type(h.getType())
                .rating(h.getRating())
                .websiteUrl(h.getWebsiteUrl())
                .emergency24x7(h.getEmergency24x7())
                .insuranceSupported(h.getInsuranceSupported())
                .imageUrl(h.getImageUrl())
                .build();
    }
}
