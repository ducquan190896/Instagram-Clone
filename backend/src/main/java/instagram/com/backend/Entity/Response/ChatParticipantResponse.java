package instagram.com.backend.Entity.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipantResponse {
    private Long id;
    private UserResponse owner;
    private Long chatId;
}
