package com.niranjan.event_ticket_mngmt_system.domain.dtos;

import com.niranjan.event_ticket_mngmt_system.domain.entities.EventStatusEnum;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetEventDetailsResponseDto {

    private UUID id;
    private String name;
    private LocalDateTime start;
    private LocalDateTime end;
    private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    private EventStatusEnum status;
    private List<GetEventTicketTypesResponseDto> ticketTypes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
