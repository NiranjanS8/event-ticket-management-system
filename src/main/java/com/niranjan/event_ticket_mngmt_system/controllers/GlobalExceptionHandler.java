package com.niranjan.event_ticket_mngmt_system.controllers;

import com.niranjan.event_ticket_mngmt_system.domain.dtos.ErrorDto;
import com.niranjan.event_ticket_mngmt_system.exceptions.UserNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorDto> handleUserNotFoundException(UserNotFoundException e) {
        log.error("Caught User not found exception", e);
        ErrorDto errorDto = new ErrorDto();
        errorDto.setMessage("User not found");
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorDto> handleConstrainViolation(ConstraintViolationException e) {
        log.error("Constrain violation occurred", e);
        ErrorDto errorDto = new ErrorDto();

        String errorMsg = e.getConstraintViolations().stream().findFirst()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .orElse("Constraint violation occurred");

        errorDto.setMessage(errorMsg);

        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(Exception e) {
        log.error("Exception occurred: {}", e.getMessage());
        ErrorDto errorDto = new ErrorDto();
        errorDto.setMessage("An unknown error occurred");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("Method argument not valid exception occurred", e);
        ErrorDto errorDto = new ErrorDto();

        String methodArgumentNotValid = e.getBindingResult().getFieldErrors()
                .stream().findFirst().map(error -> error.getDefaultMessage())
                .orElse("Method argument not valid");
        errorDto.setMessage(methodArgumentNotValid);

        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }
}
