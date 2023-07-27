package instagram.com.backend.Config;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import instagram.com.backend.Entity.Users;
import instagram.com.backend.Security.SecurityConstant;
import instagram.com.backend.Service.MessageService;
import instagram.com.backend.Service.UserService;
import instagram.com.backend.Service.ServiceImplement.UserServiceImp;

@Service
public class SocketService {
    @Autowired
    UserService userService;
    @Autowired
    MessageService messageService;
 

    public UsernamePasswordAuthenticationToken authenticateMessageToken(String username, String token) {
        UsernamePasswordAuthenticationToken authenticationToken = messageService.authenticateMessageFromSocket(username, token);

        return authenticationToken;
    }
}
