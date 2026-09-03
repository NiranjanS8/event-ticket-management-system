package com.niranjan.event_ticket_mngmt_system.domain;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTicketTypeRequest {

    private String name;
    private Double price;
    private String description;
    private Integer totalAvailable;
}
