package com.healthcare.scheduler;

import com.healthcare.entity.Appointment;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.websocket.WebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseChangeWatcher {

    private final AppointmentRepository appointmentRepository;
    private final WebSocketService webSocketService;

    // Initialize to now to avoid fetching all historical data on startup
    private LocalDateTime lastCheckTime = LocalDateTime.now().minusSeconds(1);

    @Scheduled(fixedRate = 5000)
    public void checkForDatabaseChanges() {
        try {
            LocalDateTime now = LocalDateTime.now();
            List<Appointment> updatedAppointments = appointmentRepository.findAllByUpdatedAtAfter(lastCheckTime);

            if (!updatedAppointments.isEmpty()) {
                log.info("Found {} appointments updated since {}", updatedAppointments.size(), lastCheckTime);

                // Broadcast updates
                webSocketService.broadcastDashboardUpdate();

                // Also broadcast individual appointment updates if needed
                // for (Appointment appt : updatedAppointments) { ... }

                // Update the last check time to the current time used for the query
                lastCheckTime = now;
            }
        } catch (Exception e) {
            log.error("Error checking for database changes", e);
        }
    }
}
