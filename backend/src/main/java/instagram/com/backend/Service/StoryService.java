package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Request.StoryRequest;
import instagram.com.backend.Entity.Response.StoryResponse;

public interface StoryService {
    List<StoryResponse> getStories();
    List<StoryResponse> getStoriesByActiveOwner(Long ownerId);
    List<StoryResponse> getStoriesOfFollowings();
    StoryResponse createStory(StoryRequest storyRequest);
}
