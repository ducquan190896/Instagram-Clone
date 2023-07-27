package instagram.com.backend.Mapper;

import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.UserResponse;

@Component
public class UserMapper {
    
    public UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }
}
