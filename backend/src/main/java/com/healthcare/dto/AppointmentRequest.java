package com.healthcare.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Hospital ID is required")
    private Long hospitalId;

    @NotNull(message = "Appointment date is required")
    private String appointmentDate;

    @NotNull(message = "Appointment time is required")
    private String appointmentTime;

    private String patientName;
    private String dob;
    private String gender;
    private String mobileNumber;
    private Integer age;
    private String lastAppointment;
}
