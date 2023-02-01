package instagram.com.backend.Security.Filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import instagram.com.backend.Security.SecurityConstant;

public class FilterJwtAuthorization extends OncePerRequestFilter{
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if(authorization == null || !authorization.startsWith(SecurityConstant.authorization)) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authorization.replace(SecurityConstant.authorization, "");
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(SecurityConstant.private_key)).build().verify(token);

        String username = decodedJWT.getSubject();
        List<String> claims = decodedJWT.getClaim("claims").asList(String.class);
        List<SimpleGrantedAuthority> authorities = claims.stream().map(clai -> new SimpleGrantedAuthority(clai)).collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}
