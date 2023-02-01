package instagram.com.backend.Entity.Response;

import org.springframework.security.access.method.P;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FollowResponse {
    private Long id;
    private UserResponse follower;
    private UserResponse following;
    
}
