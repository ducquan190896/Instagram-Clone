package instagram.com.backend.Entity.Response;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
public class PostResponse {
    private Long id;
    private String content;
    private List<String> imageUrls = new ArrayList<>();
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    private LocalDateTime dateCreated;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    private LocalDateTime dateUpdated;
    private Long commentCount;
    private Long likeCount;
    private UserResponse userResponse;
    private List<String> tags;

    public PostResponse(Long id, String content, LocalDateTime dateCreated, LocalDateTime dateUpdated,
            Long commentCount, Long likeCount, UserResponse userResponse) {
        this.id = id;
        this.content = content;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.commentCount = commentCount;
        this.likeCount = likeCount;
        this.userResponse = userResponse;
    }

    public PostResponse(Long id, String content, List<String> imageUrls, LocalDateTime dateCreated,
            LocalDateTime dateUpdated, Long commentCount, Long likeCount, UserResponse userResponse) {
        this.id = id;
        this.content = content;
        this.imageUrls = imageUrls;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.commentCount = commentCount;
        this.likeCount = likeCount;
        this.userResponse = userResponse;
    }
    

}
