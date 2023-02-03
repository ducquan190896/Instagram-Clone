package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.StoryLikeResponse;

public interface StoryLikeService {

    List<StoryLikeResponse> getStoryLikeByStory(Long storyId);
    // for authUser
    StoryLikeResponse likeStory(Long storyId);
    // for authUser
    void removeLikeFromStory(Long storyId);
}
