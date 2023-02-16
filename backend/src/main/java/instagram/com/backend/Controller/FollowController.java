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

import instagram.com.backend.Entity.Response.FollowResponse;
import instagram.com.backend.Service.FollowService;

@RestController
@RequestMapping("/api/follow")
public class FollowController {
    @Autowired
    FollowService followService;

    @GetMapping("/getFollowings/{followingId}")
    public ResponseEntity<List<FollowResponse>> getFollowingsOfUser(@PathVariable Long followingId) {
        return new ResponseEntity<List<FollowResponse>>(followService.getFollowingsOfUser(followingId), HttpStatus.OK);
    }
    @GetMapping("/getFollowers/{followerId}")
    public ResponseEntity<List<FollowResponse>> getFollowersOfUser(@PathVariable Long followerId) {
        return new ResponseEntity<List<FollowResponse>>(followService.getFollowersOfUser(followerId), HttpStatus.OK);
    }
    @PostMapping("followUser/{followerId}")
    public ResponseEntity<FollowResponse> followUser(@PathVariable Long followerId) {
        return new ResponseEntity<FollowResponse>(followService.followUser(followerId), HttpStatus.CREATED);
    }
    @DeleteMapping("unfollowUser/{followerId}")
    public ResponseEntity<HttpStatus> unfollowUser(@PathVariable Long followerId) {
        followService.unFollowUser(followerId);
        return new ResponseEntity<HttpStatus>( HttpStatus.CREATED);
    }

    @GetMapping("/isFollowByAuthUser/{userId}")
    public ResponseEntity<Boolean> isFollow(@PathVariable Long userId) {
        return new ResponseEntity<Boolean>(followService.isFollowByAuthUser(userId), HttpStatus.OK);
    }
}
