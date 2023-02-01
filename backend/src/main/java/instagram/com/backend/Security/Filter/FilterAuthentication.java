package instagram.com.backend.Security.Filter;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Security.CustomAuthenticationManager;
import instagram.com.backend.Security.SecurityConstant;
import instagram.com.backend.Service.UserService;
import instagram.com.backend.Service.ServiceImplement.UserServiceImp;
import lombok.AllArgsConstructor;


@AllArgsConstructor
public class FilterAuthentication extends UsernamePasswordAuthenticationFilter {
    @Autowired
    CustomAuthenticationManager customAuthenticationManager;
    @Autowired
    UserServiceImp userserviceImp;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            Users user = new ObjectMapper().readValue(request.getInputStream(), Users.class);
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        return customAuthenticationManager.authenticate(authentication);
        } catch (IOException ex ) {
            throw new RuntimeException(ex);
        }

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(failed.getMessage());
        response.getWriter().flush();
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authResult) throws IOException, ServletException {
        String username = authResult.getName();
        List<String> claims = authResult.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList());

        String token = JWT.create()
                        .withSubject(username)
                        .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.expire_time))
                        .withClaim("claims", claims)
                        .sign(Algorithm.HMAC512(SecurityConstant.private_key));
        response.setHeader("Authorization", SecurityConstant.authorization + token);
        Gson gson = new Gson();
        Users user = userserviceImp.getUserByUsername(username);
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount());
        if(user.getAvatarUrl() != null) {
            userResponse.setAvatarUrl(user.getAvatarUrl());
        }
        response.getWriter().write(gson.toJson(userResponse));
        response.getWriter().flush();
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
