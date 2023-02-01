package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.CommentNotification;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.CommentNotificationResponse;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.CommentNotificationRepos;
import instagram.com.backend.Repository.CommentRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.CommentNotificationService;

@Service
public class CommentNotificationServiceIml implements CommentNotificationService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    PostRepos postRepos;
    @Autowired
    CommentNotificationRepos commentNotificationRepos;
    @Autowired
    CommentRepos commentRepos;

    


    @Override
    public List<CommentNotificationResponse> getCommentNotificationByAuthUser() {
        List<CommentNotification> list = commentNotificationRepos.findByReceiver(getAuthUser());
        List<CommentNotificationResponse> responses = list.stream().map(notify -> mapCommentNotificationToResponse(notify)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        return responses;
    }

    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }

    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the auth user not found");
        
    }


    private PostResponse mapPostToResponse(Post post) {
        PostResponse postResponse = new PostResponse(post.getId(), post.getContent(), post.getImageUrls(), post.getDateCreated(), post.getDateUpdated(), post.getCommentCount(), post.getLikeCount(), mapUserToUserResponse(post.getOwner()));
        return postResponse;
        
    }

    private CommentNotificationResponse mapCommentNotificationToResponse(CommentNotification notification) {
        CommentNotificationResponse response = new CommentNotificationResponse(notification.getId(), notification.getType(), mapUserToUserResponse(notification.getCreator()), mapUserToUserResponse(notification.getReceiver()), mapPostToResponse(notification.getPost()), notification.getParentComment().getContent(), notification.getParentComment().getId(), notification.getDateCreated());
        return response;
    }
}
