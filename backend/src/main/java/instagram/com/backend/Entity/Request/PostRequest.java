package instagram.com.backend.Entity.Request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private String content;
    private List<String> imageUrls;
    private List<String> tags;
    private PollRequest poll;
    
    public PostRequest(String content, List<String> imageUrls) {
        this.content = content;
        this.imageUrls = imageUrls;
    }

    

    public PostRequest(String content, List<String> imageUrls, List<String> tags) {
        this.content = content;
        this.imageUrls = imageUrls;
        this.tags = tags;
    }



    public PostRequest(String content, List<String> tags, PollRequest poll) {
        this.content = content;
        this.tags = tags;
        this.poll = poll;
    }

    public PostRequest(String content, PollRequest poll) {
        this.content = content;
        this.poll = poll;
    }

    
    

    
}
