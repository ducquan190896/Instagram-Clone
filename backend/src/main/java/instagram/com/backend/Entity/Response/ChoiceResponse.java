package instagram.com.backend.Entity.Response;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChoiceResponse {
    private Long id;
    private String answer;
    private Long voteCount;
    private Long pollId;


}
