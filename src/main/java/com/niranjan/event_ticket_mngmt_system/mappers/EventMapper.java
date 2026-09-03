package com.niranjan.event_ticket_mngmt_system.mappers;

import com.niranjan.event_ticket_mngmt_system.domain.CreateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.CreateTicketTypeRequest;
import com.niranjan.event_ticket_mngmt_system.domain.dtos.CreateEventRequestDto;
import com.niranjan.event_ticket_mngmt_system.domain.dtos.CreateEventResponseDto;
import com.niranjan.event_ticket_mngmt_system.domain.dtos.CreateTicketTypeRequestDto;
import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);

}
