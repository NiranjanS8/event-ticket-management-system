package com.niranjan.event_ticket_mngmt_system.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTicketTypeRequest {

    private UUID Id;
    private String name;
    private Double price;
    private String description;
    private Integer totalAvailable;
}
