package com.niranjan.event_ticket_mngmt_system.repositories;

import com.niranjan.event_ticket_mngmt_system.domain.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventRepo extends JpaRepository<Event, UUID> {

}
