package com.niranjan.event_ticket_mngmt_system.services.impl;

import com.niranjan.event_ticket_mngmt_system.domain.CreateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.UpdateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.UpdateTicketTypeRequest;
import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;
import com.niranjan.event_ticket_mngmt_system.domain.entities.EventStatusEnum;
import com.niranjan.event_ticket_mngmt_system.domain.entities.TicketType;
import com.niranjan.event_ticket_mngmt_system.domain.entities.User;
import com.niranjan.event_ticket_mngmt_system.exceptions.EventNotFoundException;
import com.niranjan.event_ticket_mngmt_system.exceptions.EventUpdateException;
import com.niranjan.event_ticket_mngmt_system.exceptions.TicketTypeNotFoundException;
import com.niranjan.event_ticket_mngmt_system.exceptions.UserNotFoundException;
import com.niranjan.event_ticket_mngmt_system.repositories.EventRepo;
import com.niranjan.event_ticket_mngmt_system.repositories.UserRepo;
import com.niranjan.event_ticket_mngmt_system.services.EventService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final UserRepo userRepo;
    private final EventRepo eventRepo;

    @Override
    @Transactional
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

    @Override
    public Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable) {

        return eventRepo.findByOrganizerId(organizerId, pageable);
    }

    @Override
    public Optional<Event> getEventForOrganizer(UUID organizerId, UUID eventId) {
        return eventRepo.findByIdAndOrganizerId(eventId, organizerId);
    }

    @Override
    @Transactional
    public Event updateEventForOrganizer(UUID organizerId, UUID eventId, UpdateEventRequest event) {

        if(event.getId() == null){
            throw new EventUpdateException("Event ID is required");
        }

        if(!eventId.equals(event.getId())){
            throw new EventUpdateException("Cannot update the ID of an event ");
        }

        Event existingEvent = eventRepo.findByIdAndOrganizerId(eventId, organizerId)
                .orElseThrow(() -> new EventNotFoundException(
                        String.format("Event not found with ID : %s", eventId)
                ));

        existingEvent.setName(event.getName());
        existingEvent.setStartDate(event.getStartDate());
        existingEvent.setEndDate(event.getEndDate());
        existingEvent.setVenue(event.getVenue());
        existingEvent.setSalesStart(event.getSalesStart());
        existingEvent.setSalesEnd(event.getSalesEnd());
        existingEvent.setStatus(event.getStatus());

        Set<UUID> requestTicketTypeIds = event.getTicketTypes()
                .stream()
                .map(UpdateTicketTypeRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        existingEvent.getTicketTypes().removeIf(ticketType -> !requestTicketTypeIds.contains(ticketType.getId()));

        Map<UUID, TicketType> existingTicketTypesIndex = existingEvent.getTicketTypes().stream()
                .collect((Collectors.toMap(TicketType::getId, Function.identity())));

        for(UpdateTicketTypeRequest ticketType : event.getTicketTypes()){
            if(ticketType.getId() == null){
                //create
                TicketType ticketTypeToCreate = new TicketType();
                ticketTypeToCreate.setName(ticketType.getName());
                ticketTypeToCreate.setPrice(ticketType.getPrice());
                ticketTypeToCreate.setDescription(ticketType.getDescription());
                ticketTypeToCreate.setTotalAvailable(ticketType.getTotalAvailable());
                ticketTypeToCreate.setEvent(existingEvent);
                existingEvent.getTicketTypes().add(ticketTypeToCreate);

            }else if(existingTicketTypesIndex.containsKey(ticketType.getId())){
                //update
                TicketType ticketTypeToUpdate = existingTicketTypesIndex.get(ticketType.getId());
                ticketTypeToUpdate.setName(ticketType.getName());
                ticketTypeToUpdate.setPrice(ticketType.getPrice());
                ticketTypeToUpdate.setDescription(ticketType.getDescription());
                ticketTypeToUpdate.setTotalAvailable(ticketType.getTotalAvailable());

            }else{
                throw
                         new TicketTypeNotFoundException(
                                 String.format("Ticket type not found with ID : %s", ticketType.getId())
                         );
            }
        }

        return eventRepo.save(existingEvent);


    }
}
