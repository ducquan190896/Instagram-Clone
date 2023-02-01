package instagram.com.backend.Entity.Response;

import instagram.com.backend.Entity.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private boolean active;
    private String introduction;
    private Long followersCount;
    private Long followingsCount;
    private String avatarUrl;
    public UserResponse(Long id, String username, String email, Role role, boolean active, String introduction,
            Long followersCount, Long followingsCount) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.active = active;
        this.introduction = introduction;
        this.followersCount = followersCount;
        this.followingsCount = followingsCount;
    }

    public boolean getActive() {
        return this.active;
    }
}
