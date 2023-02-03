package instagram.com.backend.Entity.Response;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoryResponse {
    private long id;
    private Long likeCount;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    private LocalDateTime dateCreated; 
    private List<String> imageUrls;
    private UserResponse owner;

}
