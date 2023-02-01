package instagram.com.backend.Service.ServiceImplement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Entity.Request.PostRequest;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.PostService;

@Service
public class PostServiceIml implements PostService {
    @Autowired
    PostRepos postRepos;
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    FollowRepos followRepos;
    @Override
    public List<PostResponse> getAllPost() {
        List<Post> posts = postRepos.findAll();
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses;
    }
    @Override
    public List<PostResponse> getAllPostOfFollowings() {
       Users authUser = getAuthUser();
       List<Post> postsOfFollowings = new ArrayList<>();
       List<Follow> followings = followRepos.findByFollowing(authUser);
       followings.stream().forEach(follow -> {
        Users follower = follow.getFollower();
        if(follower.getActive() == true) {
            List<Post> followerPosts = postRepos.findByOwner(follower);
            postsOfFollowings.addAll(followerPosts);
        }
       });

       List<PostResponse> responses = postsOfFollowings.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 
    }
    @Override
    public List<PostResponse> getPostByActiveOwner(Long activeOwnerId) {
       Optional<Users> entity = usersRepos.findById(activeOwnerId);
       
       Users owner = isCheckUser(entity);
       if(owner.getActive() == false) {
        return null;
       }
       List<Post> posts = postRepos.findByOwner(owner);
       
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 

    }
    

    @Override
    public List<PostResponse> getPostByOwnerForAdminAccess(Long activeOwnerId) {
        Optional<Users> entity = usersRepos.findById(activeOwnerId);
       
       Users owner = isCheckUser(entity);
       List<Post> posts = postRepos.findByOwner(owner);
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 

    }
    @Override
    public PostResponse getPostById(Long id) {
        Optional<Post> entity = postRepos.findById(id);
        Post post = isCheckPost(entity);
        return mapPostToResponse(post);
    }
    @Override
    public List<PostResponse> getPostByAuthUser() {
       Users authUser = getAuthUser();
       List<Post> posts = postRepos.findByOwner(authUser);
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses;
    }

    

    @Override
    public void deletePost(Long id) {
        Users authUser = getAuthUser();
        Optional<Post> entity = postRepos.findById(id);
        Post post = isCheckPost(entity);
        if(authUser.getRole().equals(Role.ADMIN) || authUser.getId() == post.getOwner().getId()) {
            Users user = post.getOwner();
            user.getPosts().remove(post);
            user.setPostCounts(user.getPostCounts() - 1);
            usersRepos.save(user);
            postRepos.delete(post);
        } else {
            throw new BadResultException("unauthorized to delete post");
        }
        
    }
    @Override
    public PostResponse savePost(PostRequest postRequest) {
        Users authUser = getAuthUser();
        Post post = new Post(postRequest.getContent(), postRequest.getImageUrls(), authUser);
        postRepos.save(post);
        authUser.getPosts().add(post);
        authUser.setPostCounts(authUser.getPostCounts() + 1);
        usersRepos.save(authUser);
        return mapPostToResponse(post);

    }
    private PostResponse mapPostToResponse(Post post) {
        PostResponse postResponse = new PostResponse(post.getId(), post.getContent(), post.getImageUrls(), post.getDateCreated(), post.getDateUpdated(), post.getCommentCount(), post.getLikeCount(), mapUserToUserResponse(post.getOwner()));
        return postResponse;
        
    }

    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }
    private Users isCheckUser(Optional<Users> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }

    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheckUser(entity);
        return user;
    }

    private Post isCheckPost(Optional<Post> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the post not found");
    }
}
