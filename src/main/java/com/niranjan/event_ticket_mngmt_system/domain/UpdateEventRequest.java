package com.niranjan.event_ticket_mngmt_system.domain;

import com.niranjan.event_ticket_mngmt_system.domain.entities.EventStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEventRequest {

    private UUID Id;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    private EventStatusEnum status;
    private List<UpdateTicketTypeRequest> ticketTypes = new ArrayList<>();
}
