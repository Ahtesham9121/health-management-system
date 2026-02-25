package com.healthcare.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDTO {
    private Long id;
    private String name;
    private String state;
    private String city;
    private String type;
    private BigDecimal rating;
    private String websiteUrl;
    private Boolean emergency24x7;
    private Boolean insuranceSupported;
    private String imageUrl;
}
