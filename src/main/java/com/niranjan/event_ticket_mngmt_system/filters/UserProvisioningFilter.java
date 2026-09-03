package com.niranjan.event_ticket_mngmt_system.filters;

import com.niranjan.event_ticket_mngmt_system.domain.entities.User;
import com.niranjan.event_ticket_mngmt_system.repositories.UserRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserProvisioningFilter extends OncePerRequestFilter {

    private final UserRepo userRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof Jwt jwt){
            UUID keyCloakId = UUID.fromString((jwt.getSubject()));

            if(!userRepo.existsById(keyCloakId)){

                User user = new User();
                user.setId(keyCloakId);
                user.setName(jwt.getClaims().get("preferred_username").toString());
                user.setEmail(jwt.getClaimAsString("email"));

                userRepo.save(user);
            }
        }

        filterChain.doFilter(request, response);
    }
}
