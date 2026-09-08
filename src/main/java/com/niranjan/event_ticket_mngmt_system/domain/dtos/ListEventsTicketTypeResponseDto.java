package com.niranjan.event_ticket_mngmt_system.domain.dtos;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListEventsTicketTypeResponseDto {

    private UUID id;
    private String name;
    private Double price;
    private String description;
    private Integer totalAvailable;
}
