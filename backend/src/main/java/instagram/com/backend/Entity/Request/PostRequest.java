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
    
    public PostRequest(String content, List<String> imageUrls) {
        this.content = content;
        this.imageUrls = imageUrls;
    }

    
}
