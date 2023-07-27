package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.PostLike;
import instagram.com.backend.Entity.Response.PostLikeResponse;

@Component
public class PostLikeMapper {
    @Autowired
    UserMapper userMapper;
    
    public PostLikeResponse mapPostLikeToResponse(PostLike postLike) {
        PostLikeResponse postLikeResponse = new PostLikeResponse(postLike.getId(), userMapper.mapUserToUserResponse(postLike.getOwner()), postLike.getId());
        return postLikeResponse;
    }
}
