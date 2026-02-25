package com.healthcare.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Long id;
    private String name;
    private String degree;
    private String specialization;
    private Integer experienceYears;
    private Long hospitalId;
    private String hospitalName;
    private String imageUrl;
    private java.math.BigDecimal rating;
    private String pastExperience;
    private java.time.LocalDate degreeCompletionDate;
}
