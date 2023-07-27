package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.StoryLike;
import instagram.com.backend.Entity.Response.StoryLikeResponse;

@Component
public class StoryLikeMapper {
    @Autowired
    UserMapper userMapper;
    
    public StoryLikeResponse mapStoryLikeToResponse(StoryLike storyLike) {
        StoryLikeResponse response = new StoryLikeResponse(storyLike.getId(), storyLike.getDateCreated(), userMapper.mapUserToUserResponse(storyLike.getOwner()), storyLike.getStory().getId());
        return response;
    }
}
