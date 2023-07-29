package instagram.com.backend.Controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Request.MessageRequest;
import instagram.com.backend.Entity.Response.MessageResponse;
import instagram.com.backend.Service.MessageService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    MessageService messageService;
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<MessageResponse>> getAllByChat(@PathVariable Long chatId) {
        return new ResponseEntity<List<MessageResponse>>(messageService.getMessagesByChat(chatId), HttpStatus.OK);
    }

    @CrossOrigin
    @PostMapping("/addMessage")
    public ResponseEntity<MessageResponse> addMessage(@Valid @RequestBody MessageRequest messageRequest ) {
        MessageResponse res = messageService.addMessage(messageRequest);
        simpMessagingTemplate.convertAndSend("/chatroom/" + res.getChatId(), res);
        return new ResponseEntity<MessageResponse>(res, HttpStatus.CREATED);

    }

    @CrossOrigin
    @DeleteMapping("/removeMessage/{messageId}")
    public ResponseEntity<HttpStatus> removeMessage(@PathVariable Long messageId ) {
        messageService.deleteMessage(messageId);
        return new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT);
    }
}
