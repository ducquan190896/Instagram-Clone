package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.StoryLikeResponse;
import instagram.com.backend.Service.StoryLikeService;

@RestController
@RequestMapping("/api/storyLikes")
public class StoryLikeController {
    @Autowired
    StoryLikeService storyLikeService;

    @GetMapping("/story/{storyId}")
    public ResponseEntity<List<StoryLikeResponse>> getAllByStory(@PathVariable Long storyId) {
        return new ResponseEntity<List<StoryLikeResponse>>(storyLikeService.getStoryLikeByStory(storyId), HttpStatus.OK);
    }

    @PostMapping("/story/{storyId}")
    public ResponseEntity<StoryLikeResponse> likeStory(@PathVariable Long storyId) {
        return new ResponseEntity<StoryLikeResponse>(storyLikeService.likeStory(storyId), HttpStatus.CREATED);
    }

    @DeleteMapping("/story/{storyId}")
    public ResponseEntity<HttpStatus> removelikeFromStory(@PathVariable Long storyId) {
        storyLikeService.removeLikeFromStory(storyId);
        return new ResponseEntity<HttpStatus>( HttpStatus.NO_CONTENT);
    }

    @GetMapping("/checkStoryLikeByAuthUser/{storyId}")
    public ResponseEntity<Boolean> checkStoryLikeByAuthUser(@PathVariable Long storyId) {
        return new ResponseEntity<Boolean>(storyLikeService.checkStoryLikeByAuthUser(storyId), HttpStatus.OK);
    }

}
