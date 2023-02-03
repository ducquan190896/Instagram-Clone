package instagram.com.backend.Controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Request.StoryRequest;
import instagram.com.backend.Entity.Response.StoryResponse;
import instagram.com.backend.Repository.StoryRepos;
import instagram.com.backend.Service.StoryService;

@RestController
@RequestMapping("/api/stories")
public class StoryController {
    @Autowired
    StoryService storyService;

    @GetMapping("/public/all")
    public ResponseEntity<List<StoryResponse>> getAll() {
        return new ResponseEntity<List<StoryResponse>>(storyService.getStories(), HttpStatus.OK);
    }

    @GetMapping("/public/ActiveUser/{userId}")
    public ResponseEntity<List<StoryResponse>> getAllByActiveUser(@PathVariable Long userId) {
        return new ResponseEntity<List<StoryResponse>>(storyService.getStoriesByActiveOwner(userId), HttpStatus.OK);
    }

    // access for only authUser
    @GetMapping("/authUser/allByFollowings")
    public ResponseEntity<List<StoryResponse>> getStoriesOfFollowings() {
        return new ResponseEntity<List<StoryResponse>>(storyService.getStoriesOfFollowings(), HttpStatus.OK);
    }
      // access for only authUser
    @PostMapping("/authUser/createStory")
    public ResponseEntity<StoryResponse> createStories(@Valid @RequestBody StoryRequest storyRequest) {
          return new ResponseEntity<StoryResponse>(storyService.createStory(storyRequest), HttpStatus.OK);
      }
}
