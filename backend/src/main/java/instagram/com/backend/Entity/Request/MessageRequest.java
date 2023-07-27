package instagram.com.backend.Entity.Request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private String text;
    private Long chatId;
    private String token;
    private String username;
    public MessageRequest(String text, Long chatId) {
        this.text = text;
        this.chatId = chatId;
    }

    
}
