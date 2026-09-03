package com.niranjan.event_ticket_mngmt_system.repositories;

import com.niranjan.event_ticket_mngmt_system.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {
}
