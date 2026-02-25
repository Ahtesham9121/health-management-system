package com.healthcare.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long id;
    private String trackingId;
    private String patientName;
    private String doctorName;
    private String doctorSpecialization;
    private String hospitalName;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
    private String createdAt;
}
