package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Response.FollowResponse;

@Component
public class FollowMapper {
    
    @Autowired
    UserMapper userMapper;

    public FollowResponse mapFollowToResponse(Follow follow) {
        FollowResponse followResponse = new FollowResponse(follow.getId(), userMapper.mapUserToUserResponse(follow.getFollower()), userMapper.mapUserToUserResponse(follow.getFollowing()));
        return followResponse;
    }
}
