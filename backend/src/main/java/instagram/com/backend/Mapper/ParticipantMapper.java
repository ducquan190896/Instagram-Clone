package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import instagram.com.backend.Entity.ChatParticipant;
import instagram.com.backend.Entity.Response.ChatParticipantResponse;

@Component
public class ParticipantMapper {
    @Autowired
    UserMapper userMapper;

    public ChatParticipantResponse mapChatParticipantToResponse(ChatParticipant participant) {
        ChatParticipantResponse response = new ChatParticipantResponse(participant.getId(), userMapper.mapUserToUserResponse(participant.getOwner()), participant.getChat().getId());
        return response;
    }
}
