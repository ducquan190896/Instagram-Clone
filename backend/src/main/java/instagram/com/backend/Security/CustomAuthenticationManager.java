package instagram.com.backend.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import instagram.com.backend.Service.ServiceImplement.UserServiceImp;

@Component
public class CustomAuthenticationManager implements AuthenticationManager {
    @Autowired
    UserServiceImp userServiceImp;
   

   @Override
   public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        UserDetails user = userServiceImp.loadUserByUsername(username);
        if(!new BCryptPasswordEncoder().matches(authentication.getCredentials().toString(), user.getPassword())) {
            throw new BadCredentialsException("password prodvided is wrong");
        }

        Authentication authentication2 = new UsernamePasswordAuthenticationToken(username, user.getPassword(), user.getAuthorities());
        return authentication2;
   } 
}
