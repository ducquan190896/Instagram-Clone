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
public class CommentLikeResponse {
    private Long id;
    private UserResponse ownerResponse;
    private Long postId;
    private Long commentId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    private LocalDateTime dateCreated;
}
 