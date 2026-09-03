package com.niranjan.event_ticket_mngmt_system.domain.dtos;

import com.niranjan.event_ticket_mngmt_system.domain.CreateTicketTypeRequest;
import com.niranjan.event_ticket_mngmt_system.domain.entities.EventStatusEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateEventRequestDto {

    @NotBlank(message = "Name is required")
    private String name;


    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @NotBlank(message = "Venue is required")
    private String venue;


    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;

    @NotNull(message = "Status is required")
    private EventStatusEnum status;

    @NotEmpty(message = "At least one  Ticket type is required")
    @Valid
    private List<CreateTicketTypeRequestDto> ticketTypes = new ArrayList<>();
}
