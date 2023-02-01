package instagram.com.backend.Entity.Response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import instagram.com.backend.Entity.Enum.PostNotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostNotificationResponse {
    private Long id;
    private PostNotificationType type;
    private UserResponse creatorResponse;
    private UserResponse receiverResponse;
    private PostResponse postResponse;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateCreated;
}
