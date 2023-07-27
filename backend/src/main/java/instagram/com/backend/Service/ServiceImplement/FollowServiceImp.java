package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.FollowResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Mapper.FollowMapper;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.FollowService;
import instagram.com.backend.Service.UserService;

@Service
public class FollowServiceImp implements FollowService {
    @Autowired
    FollowRepos followRepos;
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    UserService userService;
    @Autowired
    FollowMapper followMapper;
   

    @Override
    public FollowResponse followUser( Long followerId) {
        // follower is notification receiver
        Users follower = userService.isCheckUser(followerId);
        //authUser is notification creator
        Users authUser = userService.getAuthUser();
        if(authUser.getId() == follower.getId()) {
            throw new BadResultException("the follwer and authUser are the same, cannot follow");
        }
       Follow follow = new Follow(follower, authUser);
       followRepos.save(follow);
       authUser.getFollowings().add(follow);
       authUser.setFollowingsCount(authUser.getFollowingsCount() + 1);
       follower.getFollowers().add(follow); 
       follower.setFollowersCount(follower.getFollowersCount() + 1);

       usersRepos.save(authUser);
       usersRepos.save(follower);
        return followMapper.mapFollowToResponse(follow);
    }
    

    @Override
    public void unFollowUser(Long followerId) {
        Users follower = userService.isCheckUser(followerId);
        Users authUser = userService.getAuthUser();
        Optional<Follow>  entityFollow = followRepos.findByFollowerAndFollowing(follower, authUser);
        if(!entityFollow.isPresent()) {
            throw new EntityNotFountException("the follow not found");
        }
        Follow follow = entityFollow.get();
        authUser.getFollowings().remove(follow);
        authUser.setFollowingsCount(authUser.getFollowingsCount() - 1);
        follower.getFollowers().remove(follow);
        follower.setFollowersCount(follower.getFollowersCount() - 1);
        usersRepos.save(authUser);
        usersRepos.save(follower);
        followRepos.delete(follow);
    }


    @Override
    public List<FollowResponse> getFollowersOfUser(Long followerId) {
        Users follower = userService.isCheckUser(followerId);
        List<Follow> followers = followRepos.findByFollower(follower);
        List<FollowResponse> followersResponse = followers.stream().map(follo -> followMapper.mapFollowToResponse(follo)).collect(Collectors.toList());
        return followersResponse;
        
    }


    @Override
    public List<FollowResponse> getFollowingsOfUser(Long followingId) {
        Users following = userService.isCheckUser(followingId);
        List<Follow> followings = followRepos.findByFollowing(following);
        List<FollowResponse> followingsResponse = followings.stream().map(follo -> followMapper.mapFollowToResponse(follo)).collect(Collectors.toList());
        return followingsResponse;
    }

    @Override
    public boolean isFollowByAuthUser(Long userId) {
       Users authUser = userService.getAuthUser();
       Users followerUser = userService.isCheckUser(userId);
       Optional<Follow> followEntity = followRepos.findByFollowerAndFollowing(followerUser, authUser);
       if(followEntity.isPresent()) {
        return true;
       }
       return false;
    }

}
