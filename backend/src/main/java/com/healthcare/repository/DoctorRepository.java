package com.healthcare.repository;

import com.healthcare.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByHospitalId(Long hospitalId);

    List<Doctor> findBySpecialization(String specialization);

    Page<Doctor> findByHospitalId(Long hospitalId, Pageable pageable);

    Page<Doctor> findBySpecialization(String specialization, Pageable pageable);

    long count();
}
