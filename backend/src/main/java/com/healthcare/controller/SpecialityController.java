package com.healthcare.controller;

import com.healthcare.entity.Speciality;
import com.healthcare.repository.SpecialityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialities")
@RequiredArgsConstructor
public class SpecialityController {

    private final SpecialityRepository specialityRepository;

    @GetMapping
    public ResponseEntity<List<Speciality>> getSpecialities() {
        return ResponseEntity.ok(specialityRepository.findAll());
    }
}
