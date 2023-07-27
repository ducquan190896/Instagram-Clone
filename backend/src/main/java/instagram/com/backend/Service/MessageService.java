package instagram.com.backend.Service;

import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import instagram.com.backend.Entity.Request.MessageRequest;
import instagram.com.backend.Entity.Response.MessageResponse;

public interface MessageService {
    MessageResponse addMessage(MessageRequest messageRequest);
    MessageResponse addMessageFromSocket(MessageRequest messageRequest);
    List<MessageResponse> getMessagesByChat(Long chatId);
    void deleteMessage(Long messageId);
    UsernamePasswordAuthenticationToken authenticateMessageFromSocket(String username1, String token1);
}
