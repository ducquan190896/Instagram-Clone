package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.Story;
import instagram.com.backend.Entity.Response.StoryResponse;

@Component
public class StoryMapper {
    @Autowired
    UserMapper userMapper;
    
    public StoryResponse mapStoryToResponse(Story story) {
        StoryResponse response = new StoryResponse(story.getId(), story.getLikeCount(), story.getDateCreated(), story.getImageUrls(), userMapper.mapUserToUserResponse(story.getOwner()));
        return response;
    }
}
