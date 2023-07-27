package instagram.com.backend.Mapper;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.Response.ChatParticipantResponse;
import instagram.com.backend.Entity.Response.ChatResponse;

@Component
public class ChatMapper {
    @Autowired
    ParticipantMapper participantMapper;

    public ChatResponse mapChatToResponse(Chat chat) {
        List<ChatParticipantResponse> participantResponse = chat.getParticipants().stream().map(participant -> participantMapper.mapChatParticipantToResponse(participant)).collect(Collectors.toList());
        ChatResponse response = new ChatResponse(chat.getId(), chat.getActive(), chat.getDateCreated(), chat.getDateUpdated(), participantResponse);

        return response;
    }
}
