package com.niranjan.event_ticket_mngmt_system.services.impl;

import com.niranjan.event_ticket_mngmt_system.domain.CreateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;
import com.niranjan.event_ticket_mngmt_system.domain.entities.EventStatusEnum;
import com.niranjan.event_ticket_mngmt_system.domain.entities.TicketType;
import com.niranjan.event_ticket_mngmt_system.domain.entities.User;
import com.niranjan.event_ticket_mngmt_system.exceptions.UserNotFoundException;
import com.niranjan.event_ticket_mngmt_system.repositories.EventRepo;
import com.niranjan.event_ticket_mngmt_system.repositories.UserRepo;
import com.niranjan.event_ticket_mngmt_system.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final UserRepo userRepo;
    private final EventRepo eventRepo;

    @Override
    public Event createEvent(UUID organizerId, CreateEventRequest event) {
        User organizer = userRepo.findById(organizerId)
                .orElseThrow(() -> new UserNotFoundException(
                        String.format("User not found with ID : %s", organizerId)));
        Event eventToCreate = new Event();
        eventToCreate.setName(event.getName());
        eventToCreate.setStartDate(event.getStartDate());
        eventToCreate.setEndDate(event.getEndDate());
        eventToCreate.setVenue(event.getVenue());
        eventToCreate.setSalesStart(event.getSalesStart());
        eventToCreate.setSalesEnd(event.getSalesEnd());
        eventToCreate.setStatus(event.getStatus() != null ? event.getStatus() : EventStatusEnum.DRAFT);
        eventToCreate.setOrganizer(organizer);

        List<TicketType> ticketTypesToCreate = event.getTicketTypes().stream().map(ticketType -> {
            TicketType ticketTypeToCreate = new TicketType();
            ticketTypeToCreate.setName(ticketType.getName());
            ticketTypeToCreate.setPrice(ticketType.getPrice());
            ticketTypeToCreate.setDescription(ticketType.getDescription());
            ticketTypeToCreate.setTotalAvailable(ticketType.getTotalAvailable());
            ticketTypeToCreate.setEvent(eventToCreate);

            return ticketTypeToCreate;
        }).toList();

        eventToCreate.setTicketTypes(ticketTypesToCreate);

        return eventRepo.save(eventToCreate);
    }
}
