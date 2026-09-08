package com.niranjan.event_ticket_mngmt_system.repositories;

import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepo extends JpaRepository<Event, UUID> {

    Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);

    Optional<Event> findByIdAndOrganizerId(UUID eventId, UUID organizerId);

}
