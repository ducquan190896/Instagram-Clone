package instagram.com.backend.Controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Request.ChangePasswordRequest;
import instagram.com.backend.Entity.Request.UserRequest;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService;
    //admin access
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAll() {
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);
    }
    //user access
    @GetMapping("/searchByActiveName/{name}")
    public ResponseEntity<List<UserResponse>> getAllByActiveName(@PathVariable String name) {
        return new ResponseEntity<>(userService.getActiveUsersByName(name), HttpStatus.OK);
    }
    //admin access
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/searchByName/{name}")
    public ResponseEntity<List<UserResponse>> getAllByName(@PathVariable String name) {
        return new ResponseEntity<>(userService.getAllUsersByName(name), HttpStatus.OK);
    }
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return new ResponseEntity<>(userService.getUserByUserName(username), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/id/adminAccess/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<UserResponse> getUserByIdByUserAccess(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserByIdByUserAccess(id), HttpStatus.OK);
    }
    @PostMapping("/register")
    public ResponseEntity<UserResponse> Register(@Valid @RequestBody UserRequest userRequest) {
    
        return new ResponseEntity<>(userService.saveUser(userRequest), HttpStatus.OK);
    }
    @PutMapping("/changePassword")
    public ResponseEntity<UserResponse> updatePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        return new ResponseEntity<>(userService.changePassword(changePasswordRequest), HttpStatus.OK);
    }
    @PutMapping("/deactivateUser")
    public ResponseEntity<UserResponse> deactiveAuthUser() {
        return new ResponseEntity<>(userService.deactiveUser(), HttpStatus.OK);
    }

    @PutMapping("/reactivateUser")
    public ResponseEntity<UserResponse> reactiveAuthUser() {
        return new ResponseEntity<>(userService.reactivateUser(), HttpStatus.OK);
    }
}
