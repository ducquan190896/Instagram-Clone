package instagram.com.backend.Entity.Response;
import instagram.com.backend.Entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponse {
    private Long id;
    private UserResponse owner;
    private Long pollId;
    private Long choiceId;
}
