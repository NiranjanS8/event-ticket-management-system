package com.niranjan.event_ticket_mngmt_system.controllers;

import com.niranjan.event_ticket_mngmt_system.domain.CreateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.UpdateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.dtos.*;
import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;
import com.niranjan.event_ticket_mngmt_system.mappers.EventMapper;
import com.niranjan.event_ticket_mngmt_system.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import org.springframework.web.service.annotation.GetExchange;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventMapper eventMapper;
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<CreateEventResponseDto> createEvent(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateEventRequestDto createEventRequestDto
    ) {
        CreateEventRequest createEventRequest = eventMapper.fromDto(createEventRequestDto);

        UUID userId = UUID.fromString(jwt.getSubject());

        Event createdEvent = eventService.createEvent(userId, createEventRequest);

        CreateEventResponseDto createdRespDto = eventMapper.toDto(createdEvent);

        return ResponseEntity.ok(createdRespDto);


    }

    @GetMapping
    public ResponseEntity<Page<ListEventResponseDto>> listEvents(
            @AuthenticationPrincipal Jwt jwt, Pageable pageable
    ) {

        UUID userId = parseUserId(jwt);
        Page<Event> events = eventService.listEventsForOrganizer(userId, pageable);
        Page<ListEventResponseDto> map = events.map(eventMapper::toListEventResponseDto);

        return ResponseEntity.ok(map);
    }

    private UUID parseUserId(Jwt jwt){
        return UUID.fromString(jwt.getSubject());
    }


    @GetMapping(path = "/{eventId}")
    public ResponseEntity<GetEventDetailsResponseDto> getEvent(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID eventId
    ){
        UUID userId = parseUserId(jwt);
        return eventService.getEventForOrganizer(userId, eventId)
                .map(eventMapper::toGetEventDetailsResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

    @PutMapping(path = "/{eventId}")
    public ResponseEntity<UpdateEventResponseDto> updateEvent(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateEventRequestDto updateEventRequestDto
    ){
        UpdateEventRequest updateEventRequest = eventMapper.fromDto(updateEventRequestDto);

        UUID userId = parseUserId(jwt);

        Event updatedEvent = eventService.updateEventForOrganizer(userId, eventId, updateEventRequest);

        UpdateEventResponseDto updateEventResponseDto = eventMapper.toUpdateEventResponseDto(updatedEvent);

        return ResponseEntity.ok(updateEventResponseDto);
    }



}
