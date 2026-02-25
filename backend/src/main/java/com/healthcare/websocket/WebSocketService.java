package com.healthcare.websocket;

import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.DashboardStats;
import com.healthcare.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private DashboardService dashboardService;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @org.springframework.beans.factory.annotation.Autowired
    @Lazy
    public void setDashboardService(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    public void broadcastAppointmentUpdate(AppointmentResponse appointment) {
        messagingTemplate.convertAndSend("/topic/appointments", appointment);
    }

    public void broadcastDashboardUpdate() {
        if (dashboardService != null) {
            DashboardStats stats = dashboardService.getStats();
            messagingTemplate.convertAndSend("/topic/dashboard", stats);
        }
    }
}
