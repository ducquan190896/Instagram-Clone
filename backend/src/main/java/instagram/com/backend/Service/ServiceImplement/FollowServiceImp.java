package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.FollowResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.FollowService;

@Service
public class FollowServiceImp implements FollowService {
    @Autowired
    FollowRepos followRepos;
    @Autowired
    UsersRepos usersRepos;

    @Override
    public FollowResponse followUser( Long followerId) {
        Optional<Users> entity = usersRepos.findById(followerId);
        Users follower = isCheckUser(entity);
        Users authUser = getAuthUser();
       Follow follow = new Follow(follower, authUser);
       followRepos.save(follow);
       authUser.getFollowings().add(follow);
       authUser.setFollowingsCount(authUser.getFollowingsCount() + 1);
       follower.getFollowers().add(follow); 
       follower.setFollowersCount(follower.getFollowersCount() + 1);
       usersRepos.save(authUser);
       usersRepos.save(follower);
        return mapFollowToResponse(follow);
    }
    

    @Override
    public void unFollowUser(Long followerId) {
        Optional<Users> entity = usersRepos.findById(followerId);
        Users follower = isCheckUser(entity);
        Users authUser = getAuthUser();
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
        Optional<Users> entity = usersRepos.findById(followerId);
        Users follower = isCheckUser(entity);
        List<Follow> followers = followRepos.findByFollower(follower);
        List<FollowResponse> followersResponse = followers.stream().map(follo -> mapFollowToResponse(follo)).collect(Collectors.toList());
        return followersResponse;
        
    }


    @Override
    public List<FollowResponse> getFollowingsOfUser(Long followingId) {
        Optional<Users> entity = usersRepos.findById(followingId);
        Users following = isCheckUser(entity);
        List<Follow> followings = followRepos.findByFollowing(following);
        List<FollowResponse> followingsResponse = followings.stream().map(follo -> mapFollowToResponse(follo)).collect(Collectors.toList());
        return followingsResponse;
    }


    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
       
    }
    private Users isCheckUser(Optional<Users> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }
    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl());

        return userresResponse;

    }
    private FollowResponse mapFollowToResponse(Follow follow) {
        FollowResponse followResponse = new FollowResponse(follow.getId(), mapUserToUserResponse(follow.getFollower()), mapUserToUserResponse(follow.getFollowing()));
        return followResponse;
    }


    
}
