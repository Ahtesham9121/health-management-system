package com.healthcare.controller;

import com.healthcare.entity.City;
import com.healthcare.entity.State;
import com.healthcare.repository.CityRepository;
import com.healthcare.repository.StateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LocationController {

    private final StateRepository stateRepository;
    private final CityRepository cityRepository;

    @GetMapping("/states")
    public ResponseEntity<List<Map<String, Object>>> getStates() {
        List<Map<String, Object>> states = stateRepository.findAll().stream()
                .map(s -> Map.<String, Object>of("id", s.getId(), "name", s.getName()))
                .toList();
        return ResponseEntity.ok(states);
    }

    @GetMapping("/cities")
    public ResponseEntity<List<Map<String, Object>>> getCities(
            @RequestParam(required = false) Long stateId) {
        List<City> cities;
        if (stateId != null) {
            cities = cityRepository.findByStateId(stateId);
        } else {
            cities = cityRepository.findAll();
        }
        List<Map<String, Object>> result = cities.stream()
                .map(c -> Map.<String, Object>of("id", c.getId(), "name", c.getName(),
                        "stateId", c.getState().getId()))
                .toList();
        return ResponseEntity.ok(result);
    }
}
