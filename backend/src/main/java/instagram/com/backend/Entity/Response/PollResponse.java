package instagram.com.backend.Entity.Response;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PollResponse {
    private Long id;
    private String question;
    private int expireDays;
    private Long postId;
    private List<ChoiceResponse> choices = new ArrayList<>();
    public PollResponse(Long id, String question, int expireDays, Long postId) {
        this.id = id;
        this.question = question;
        this.expireDays = expireDays;
        this.postId = postId;
    }

    
}
