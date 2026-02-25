package com.healthcare.repository;

import com.healthcare.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<Appointment> findByTrackingId(String trackingId);

    List<Appointment> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    long countByStatus(Appointment.Status status);

    @Query("SELECT MAX(a.id) FROM Appointment a")
    Long findMaxId();

    List<Appointment> findTop10ByOrderByCreatedAtDesc();

    List<Appointment> findAllByUpdatedAtAfter(java.time.LocalDateTime lastCheckTime);
}
