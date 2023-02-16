package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.FollowResponse;

public interface FollowService {
    FollowResponse followUser(Long followerId);
    void unFollowUser(Long followerId);
    //get list of people who the user is following, so the user is a following
    List<FollowResponse> getFollowingsOfUser(Long followingId);
    // get list of people who are following the user, so the user is a follower
    List<FollowResponse> getFollowersOfUser(Long followerId);
    boolean isFollowByAuthUser(Long userId);
}
