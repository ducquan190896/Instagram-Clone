package instagram.com.backend.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Request.MessageRequest;
import instagram.com.backend.Entity.Response.MessageResponse;
import instagram.com.backend.Service.MessageService;

@RestController
@RequestMapping("")
public class SocketController {
    @Autowired
    MessageService messageService;
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    public void sendMessage(@Payload MessageRequest messageRequest) {
        MessageResponse response = messageService.addMessageFromSocket(messageRequest);
        Long chatIDstring = response.getChatId();
        String chatID = String.valueOf(chatIDstring);
        simpMessagingTemplate.convertAndSend("/chatroom/" + chatID, response);
    }
}
