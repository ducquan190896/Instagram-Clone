package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.Message;
import instagram.com.backend.Entity.Response.MessageResponse;

@Component
public class MessageMapper {
    @Autowired
    ParticipantMapper participantMapper;

    public MessageResponse mapMessageToResponse(Message message) {
        MessageResponse response = new MessageResponse(message.getId(), message.getText(), message.getChat().getId(), participantMapper.mapChatParticipantToResponse(message.getChatParticipant()));
        return response;
    }
}
