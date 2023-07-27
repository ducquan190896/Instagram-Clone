package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Request.ChangePasswordRequest;
import instagram.com.backend.Entity.Request.UserRequest;
import instagram.com.backend.Entity.Response.UserResponse;

public interface UserService {
    
    List<UserResponse> getUsers();
    //user access
    List<UserResponse> getActiveUsersByName(String name);
    //admin access
    List<UserResponse> getAllUsersByName(String name);
    UserResponse getUserByUserName(String username);
    //admin access
    UserResponse getUserById(Long id);
    //userAccess
    UserResponse getUserByIdByUserAccess(Long id);
    UserResponse saveUser(UserRequest userRequest);
    UserResponse changePassword(ChangePasswordRequest changePasswordRequest);
    void deleteUser(Long id);
    UserResponse deactiveUser();
    UserResponse reactivateUser();
    Users getAuthUser();
    Users isCheckUser(Long userId);
}
