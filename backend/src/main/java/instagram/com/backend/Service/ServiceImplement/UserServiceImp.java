package instagram.com.backend.Service.ServiceImplement;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Entity.Request.ChangePasswordRequest;
import instagram.com.backend.Entity.Request.UserRequest;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Mapper.UserMapper;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Security.SecurityConstant;
import instagram.com.backend.Service.UserService;

@Service
public class UserServiceImp implements UserService, UserDetailsService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    HttpServletResponse response;
    @Autowired
    UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheck(entity);
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().getName()));
        User userDetail = new User(username, user.getPassword(), authorities);
        return userDetail;
    }


    public Users getUserByUsername(String username) {
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheck(entity);
        return user;
    }

    

    @Override
    public UserResponse getUserByUserName(String username) {
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheck(entity);
        UserResponse userResponse = userMapper.mapUserToUserResponse(user);
        return userResponse;
    }

    
    @Override
    public void deleteUser(Long id) {
        Optional<Users> entity = usersRepos.findById(id);
        Users user = isCheck(entity);
        usersRepos.delete(user);
    }


    @Override
    public UserResponse getUserById(Long id) {
        Optional<Users> entity = usersRepos.findById(id);
        Users user = isCheck(entity);
        UserResponse userResponse = userMapper.mapUserToUserResponse(user);
        return userResponse;
    }
    

    @Override
    public UserResponse getUserByIdByUserAccess(Long id) {
        Optional<Users> entity = usersRepos.findById(id);
        Users user = isCheck(entity);
        if(user.getActive() == false) {
            return null;
        }
        UserResponse userResponse = userMapper.mapUserToUserResponse(user);
        return userResponse;
    }


    @Override
    public List<UserResponse> getUsers() {

        List<Users> users = usersRepos.findAll(Sort.by(Sort.Direction.ASC, "username"));
        List<UserResponse> userResponses = users.stream().map(user -> userMapper.mapUserToUserResponse(user)).collect(Collectors.toList());
        return userResponses;
    }


    @Override
    public List<UserResponse> getActiveUsersByName(String name) {
        
        List<Users> users = usersRepos.findByActiveAndUsernameContaining(true, name);
        users.sort((a, b) -> a.getUsername().compareTo(b.getUsername()));
        List<UserResponse> userResponses = users.stream().map(user -> userMapper.mapUserToUserResponse(user)).collect(Collectors.toList());
        return userResponses;
    }
    


    @Override
    public List<UserResponse> getAllUsersByName(String name) {
        List<Users> users = usersRepos.findByUsernameContaining( name);
        users.sort((a, b) -> a.getUsername().compareTo(b.getUsername()));
        List<UserResponse> userResponses = users.stream().map(user -> userMapper.mapUserToUserResponse(user)).collect(Collectors.toList());
        return userResponses;
    }


    @Override
    public UserResponse saveUser(UserRequest userRequest) {
        if(!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
            throw new BadResultException("the passwords don't match");
        }

        Optional<Users> usernameEntity = usersRepos.findByUsername(userRequest.getUsername());
        if(usernameEntity.isPresent()) {
            throw new EntityexistingException("the username exist");
        }

        Optional<Users> emailEntity = usersRepos.findByEmail(userRequest.getEmail());
        if(emailEntity.isPresent()) {
            throw new EntityexistingException("the email exist");
        }

       Users user = new Users(userRequest.getUsername(), userRequest.getEmail(), new BCryptPasswordEncoder().encode(userRequest.getConfirmPassword()), userRequest.getIntroduction());
       if(userRequest.getAvatarUrl() != null) {
        user.setAvatarUrl(userRequest.getAvatarUrl());
       }
       user.setRole(Role.USER);
       usersRepos.save(user);
       List<String> claims = new ArrayList<>();
       claims.add(user.getRole().getName());
       
       String token = JWT.create()
       .withSubject(user.getUsername())
       .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.expire_time))
       .withClaim("claims", claims)
       .sign(Algorithm.HMAC512(SecurityConstant.private_key));
       
        response.setHeader("Authorization", SecurityConstant.authorization + token);

       UserResponse userResponse = userMapper.mapUserToUserResponse(user);
       return userResponse;
    }

    @Override
    public UserResponse changePassword(ChangePasswordRequest changePasswordRequest) {
        Users user = getAuthUser();
        if(!new BCryptPasswordEncoder().matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new BadResultException("the current password is wrong");
        }
        if(!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getNewPassword())) {
            throw new BadResultException("the new and confirmed password are wrong");
        }
        user.setPassword(new BCryptPasswordEncoder().encode(changePasswordRequest.getNewPassword()));
        usersRepos.save(user);
        List<String> claims = new ArrayList<>();
        claims.add(user.getRole().getName());
        
        String token = JWT.create()
        .withSubject(user.getUsername())
        .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.expire_time))
        .withClaim("claims", claims)
        .sign(Algorithm.HMAC512(SecurityConstant.private_key));
        
         response.setHeader("Authorization", SecurityConstant.authorization + token);
 
        return userMapper.mapUserToUserResponse(user);

    }


    @Override
    public UserResponse deactiveUser() {
         Users user = getAuthUser();
         user.setActive(false);
         usersRepos.save(user);
         return userMapper.mapUserToUserResponse(user);
    }


    @Override
    public UserResponse reactivateUser() {
        Users user = getAuthUser();
         user.setActive(true);
         usersRepos.save(user);
         return userMapper.mapUserToUserResponse(user);
    }


    private Users isCheck(Optional<Users> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }

    @Override
    public Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheck(entity);
        return user;
    }

    @Override
    public Users isCheckUser(Long userId) {
        Optional<Users> entity = usersRepos.findById(userId);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }
}
