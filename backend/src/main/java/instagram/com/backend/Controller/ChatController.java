package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.ChatResponse;
import instagram.com.backend.Service.ChatService;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    @Autowired
    ChatService chatService;

    @GetMapping("/byAuthUser")
    public ResponseEntity<List<ChatResponse>> getAllByAuthUser() {
        return new ResponseEntity<List<ChatResponse>>(chatService.getChatsByAuthUser(), HttpStatus.OK);
    }

    //admin access
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ChatResponse>> getAll() {
        return new ResponseEntity<List<ChatResponse>>(chatService.getAllChats(), HttpStatus.OK);
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<ChatResponse> getChatByAuthUserAndReceiver(@PathVariable Long receiverId) {
        return new ResponseEntity<ChatResponse>(chatService.getChatByAuthUserAndReceiver(receiverId), HttpStatus.OK);
    }
    @GetMapping("/chat/{chatId}")
    public ResponseEntity<ChatResponse> getChatById(@PathVariable Long chatId) {
        return new ResponseEntity<ChatResponse>(chatService.getChatById(chatId), HttpStatus.OK);
    }
}
