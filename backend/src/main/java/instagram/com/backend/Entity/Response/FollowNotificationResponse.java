package instagram.com.backend.Entity.Response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FollowNotificationResponse {
    private Long id;
    private  String type = "follow_notification";
    private UserResponse creator;
    private UserResponse receiver;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateCreated;
    public FollowNotificationResponse(Long id, UserResponse creator, UserResponse receiver, LocalDateTime dateCreated) {
        this.id = id;
        this.creator = creator;
        this.receiver = receiver;
        this.dateCreated = dateCreated;
    }

    
}
