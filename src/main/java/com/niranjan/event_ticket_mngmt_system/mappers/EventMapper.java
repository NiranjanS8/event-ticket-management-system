package com.niranjan.event_ticket_mngmt_system.mappers;

import com.niranjan.event_ticket_mngmt_system.domain.CreateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.CreateTicketTypeRequest;
import com.niranjan.event_ticket_mngmt_system.domain.UpdateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.UpdateTicketTypeRequest;
import com.niranjan.event_ticket_mngmt_system.domain.dtos.*;
import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;
import com.niranjan.event_ticket_mngmt_system.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);

    ListEventsTicketTypeResponseDto toDto(TicketType ticketType);

    ListEventResponseDto toListEventResponseDto(Event event);

    GetEventTicketTypesResponseDto toGetEventTicketTypesResponseDto(TicketType ticketType);

    GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

    UpdateTicketTypeRequest fromDto(UpdateTicketTypeRequestDto dto);

    UpdateEventRequest fromDto(UpdateEventRequestDto dto);

    UpdateEventResponseDto toUpdateEventResponseDto(Event event);

    UpdateTicketTypeResponseDto toUpdateTicketTypeResponseDto(TicketType ticketType);

}
