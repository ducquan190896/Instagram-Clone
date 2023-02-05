package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Request.MessageRequest;
import instagram.com.backend.Entity.Response.MessageResponse;

public interface MessageService {
    MessageResponse addMessage(MessageRequest messageRequest);
    List<MessageResponse> getMessagesByChat(Long chatId);
    void deleteMessage(Long messageId);
}
