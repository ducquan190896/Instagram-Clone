package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.PostLike;
import instagram.com.backend.Entity.PostNotification;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.PostNotificationType;
import instagram.com.backend.Entity.Response.PostLikeResponse;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Repository.PostLikeRepos;
import instagram.com.backend.Repository.PostNotificationRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.PostLikeService;

@Service
public class PostLikeServiceIml implements PostLikeService {
    @Autowired
    PostLikeRepos postLikeRepos;
    @Autowired
    PostRepos postRepos;
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    PostNotificationRepos postNotificationRepos;


    @Override
    public List<PostLikeResponse> getPostLikesByPost(Long postId) {
        Post post = isCheckPost(postId);
        List<PostLike> postLikes = postLikeRepos.findByPost(post);
        List<PostLikeResponse> responses = postLikes.stream().map(postlike ->mapPostLikeToResponse(postlike)).collect(Collectors.toList());
        return responses;
    }
    @Override
    public PostLikeResponse likePost(Long postId) {
        Users authUser = getAuthUser();
        Post post = isCheckPost(postId);
        Users receiver = post.getOwner();
        Optional<PostLike> entity = postLikeRepos.findByPostAndOwner(post, authUser);
        if(entity.isPresent()) {
            throw new EntityexistingException("the user already liked the post in the past, cannot like it one more time");
        }
        PostLike postLike = new PostLike(authUser, post);
        postLikeRepos.save(postLike);
        authUser.getPostLikes().add(postLike);
        post.getPostLikes().add(postLike);
        post.setLikeCount(post.getLikeCount() + 1);
        

        PostNotification postNotification = new PostNotification(PostNotificationType.POST_LIKE, authUser, receiver, post);
        postNotificationRepos.save(postNotification);

        post.getPostNotifications().add(postNotification);
        postRepos.save(post);

        authUser.getPostNotificationsCreator().add(postNotification);
        usersRepos.save(authUser);

        receiver.getPostNotificationsReceiver().add(postNotification);
        usersRepos.save(receiver);

        PostLikeResponse postLikeResponse = mapPostLikeToResponse(postLike);
        return postLikeResponse;
    }
    @Override
    public void removeLikeFromPost(Long postId) {
        Users authUser = getAuthUser();
        Post post = isCheckPost(postId);
        Optional<PostLike> entity = postLikeRepos.findByPostAndOwner(post, authUser);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the post like not found, cannot remove post like");
        }
        PostLike postLike = entity.get();
        authUser.getPostLikes().remove(postLike);
        post.getPostLikes().remove(postLike);
        post.setLikeCount(post.getLikeCount() - 1);
        postRepos.save(post);
        usersRepos.save(authUser);
        postLikeRepos.delete(postLike);
    }

    private Post isCheckPost(Long postId) {
        Optional<Post> entity = postRepos.findById(postId);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the post not found");
    }
    
    private Users isCheckUser(Optional<Users> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }
    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }

    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheckUser(entity);
        return user;
    }

    private PostLikeResponse mapPostLikeToResponse(PostLike postLike) {
        PostLikeResponse postLikeResponse = new PostLikeResponse(postLike.getId(), mapUserToUserResponse(postLike.getOwner()), postLike.getId());
        return postLikeResponse;
    }

    private PostResponse mapPostToResponse(Post post) {
        PostResponse postResponse = new PostResponse(post.getId(), post.getContent(), post.getImageUrls(), post.getDateCreated(), post.getDateUpdated(), post.getCommentCount(), post.getLikeCount(), mapUserToUserResponse(post.getOwner()));
        return postResponse;
        
    }
}
