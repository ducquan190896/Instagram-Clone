package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.Response.ChatResponse;

public interface ChatService {
    List<ChatResponse> getChatsByAuthUser();
    //for admin
    List<ChatResponse> getAllChats();
    ChatResponse getChatByAuthUserAndReceiver(Long receiverId);
    ChatResponse getChatById(Long chatId);
}
