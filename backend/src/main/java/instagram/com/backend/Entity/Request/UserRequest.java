package instagram.com.backend.Entity.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String username;
    private String email;
    private String introduction;
    private String avatarUrl;
    private String password;
    private String confirmPassword;

    public UserRequest(String username, String email, String introduction, String password, String confirmPassword) {
        this.username = username;
        this.email = email;
        this.introduction = introduction;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
   
    
}
