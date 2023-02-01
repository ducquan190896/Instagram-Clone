package instagram.com.backend;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Exception.ErrorResponse;

@ControllerAdvice
public class BackendExceptionHandling {

    @ExceptionHandler( {EntityNotFountException.class, EntityexistingException.class, BadResultException.class}) 
    public ResponseEntity<Object> handlingAppException(RuntimeException ex) {
        ErrorResponse err = new ErrorResponse(ex.getMessage(), ex);
        return new ResponseEntity<Object>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) 
    public ResponseEntity<Object> handlingArgumentException(MethodArgumentNotValidException ex) {
        ErrorResponse err = new ErrorResponse(ex.getMessage(), ex);
        return new ResponseEntity<Object>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class) 
    public ResponseEntity<Object> handlingDataIntegrityException(DataIntegrityViolationException ex) {
        ErrorResponse err = new ErrorResponse(ex.getMessage(), ex);
        return new ResponseEntity<Object>(err, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ConstraintViolationException.class) 
    public ResponseEntity<Object> handlingConstrainsViolationException(ConstraintViolationException ex) {
        ErrorResponse err = new ErrorResponse(ex.getMessage(), ex);
        return new ResponseEntity<Object>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmptyResultDataAccessException.class) 
    public ResponseEntity<Object> handlingEmptyResultException(EmptyResultDataAccessException ex) {
        ErrorResponse err = new ErrorResponse(ex.getMessage(), ex);
        return new ResponseEntity<Object>(err, HttpStatus.BAD_REQUEST);
    }
    
}
