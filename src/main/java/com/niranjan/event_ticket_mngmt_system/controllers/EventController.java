package com.niranjan.event_ticket_mngmt_system.controllers;

import com.niranjan.event_ticket_mngmt_system.domain.CreateEventRequest;
import com.niranjan.event_ticket_mngmt_system.domain.dtos.CreateEventRequestDto;
import com.niranjan.event_ticket_mngmt_system.domain.dtos.CreateEventResponseDto;
import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;
import com.niranjan.event_ticket_mngmt_system.mappers.EventMapper;
import com.niranjan.event_ticket_mngmt_system.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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



}
