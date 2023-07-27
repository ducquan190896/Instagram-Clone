package instagram.com.backend.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class SocketChannelInterceptor implements ChannelInterceptor {
    
    @Autowired
    SocketService socketService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        assert accessor != null;
        if(accessor.getCommand() ==  StompCommand.CONNECT) {
            String username = accessor.getFirstNativeHeader("username");
            String token = accessor.getFirstNativeHeader("token");
            UsernamePasswordAuthenticationToken user = socketService.authenticateMessageToken(username, token);
            accessor.setUser(user);
        }
        return message;
    }
}
