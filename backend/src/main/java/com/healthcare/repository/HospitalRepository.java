package com.healthcare.repository;

import com.healthcare.entity.Hospital;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByState(String state);

    List<Hospital> findByCity(String city);

    List<Hospital> findByType(String type);

    @Query("SELECT h FROM Hospital h WHERE " +
            "(:state IS NULL OR h.state = :state) AND " +
            "(:city IS NULL OR h.city = :city) AND " +
            "(:type IS NULL OR h.type = :type)")
    Page<Hospital> findByFilters(
            @Param("state") String state,
            @Param("city") String city,
            @Param("type") String type,
            Pageable pageable);

    @Query("SELECT h FROM Hospital h WHERE " +
            "LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(h.city) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(h.state) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Hospital> searchHospitals(@Param("search") String search, Pageable pageable);

    long count();
}
