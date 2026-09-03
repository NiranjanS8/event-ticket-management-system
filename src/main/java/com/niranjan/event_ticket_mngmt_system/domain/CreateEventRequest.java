package com.niranjan.event_ticket_mngmt_system.domain;

import com.niranjan.event_ticket_mngmt_system.domain.entities.EventStatusEnum;
import com.niranjan.event_ticket_mngmt_system.domain.entities.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateEventRequest {

    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    private EventStatusEnum status;
    private List<CreateTicketTypeRequest> ticketTypes = new ArrayList<>();
}
