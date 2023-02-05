package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Choice;
import instagram.com.backend.Entity.Comment;
import instagram.com.backend.Entity.CommentNotification;
import instagram.com.backend.Entity.Poll;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.PostNotification;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.CommentNotificationType;
import instagram.com.backend.Entity.Enum.PostNotificationType;
import instagram.com.backend.Entity.Request.CommentRequest;
import instagram.com.backend.Entity.Response.ChoiceResponse;
import instagram.com.backend.Entity.Response.CommentResponse;
import instagram.com.backend.Entity.Response.PollResponse;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.CommentNotificationRepos;
import instagram.com.backend.Repository.CommentRepos;
import instagram.com.backend.Repository.PostNotificationRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.CommentService;

@Service
public class CommentServiceIml implements CommentService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    PostRepos postRepos;
    @Autowired
    CommentRepos commentRepos;
    @Autowired
    PostNotificationRepos postNotificationRepos;
    @Autowired
    CommentNotificationRepos commentNotificationRepos;

    @Override
    public CommentResponse addCommentToParentComment(CommentRequest commentRequest) {
        Users authUser = getAuthUser();
        Post post = isCheckPost(commentRequest.getPostId());
        Comment comment = new Comment(commentRequest.getContent(), authUser, post);

        //add child comment to parent comment
        Comment parentComment = isCheckComment(commentRequest.getParentCommentId());
        comment.addCommentToParentComment(parentComment);
        commentRepos.save(comment);
        
        Users postReceiver = post.getOwner();
        Users commentReceiver =  parentComment.getOwner();


        PostNotification postNotification = new PostNotification(PostNotificationType.POST_COMMENT, authUser, postReceiver, post);
        postNotificationRepos.save(postNotification);

        CommentNotification commentNotification = new CommentNotification(CommentNotificationType.ADD_COMMENT_TO_PARENT_COMMENT, authUser, commentReceiver, post, parentComment);
        commentNotificationRepos.save(commentNotification);

        parentComment.getCommentNotifications().add(commentNotification);
        commentRepos.save(parentComment);

        post.setCommentCount(post.getCommentCount() + 1);
        post.getComments().add(comment);
        post.getCommentNotifications().add(commentNotification);
        post.getPostNotifications().add(postNotification);
        postRepos.save(post);

        authUser.getComments().add(comment);
        authUser.getPostNotificationsCreator().add(postNotification);
        authUser.getCommentNotificationsCreator().add(commentNotification);
        usersRepos.save(authUser);

        postReceiver.getPostNotificationsReceiver().add(postNotification);
        usersRepos.save(postReceiver);

        commentReceiver.getCommentNotificationsReceiver().add(commentNotification);
        usersRepos.save(commentReceiver);


        return mapCommentToResponse(comment);
    }

    @Override
    public CommentResponse addCommentToPost(CommentRequest commentRequest) {
        Users authUser = getAuthUser();
        Post post = isCheckPost(commentRequest.getPostId());
        Comment comment = new Comment(commentRequest.getContent(), authUser, post);
        commentRepos.save(comment);      

        Users receiver = post.getOwner();

        PostNotification postNotification = new PostNotification(PostNotificationType.POST_COMMENT, authUser, receiver, post);
        postNotificationRepos.save(postNotification);

        post.setCommentCount(post.getCommentCount() + 1);
        post.getComments().add(comment);
        post.getPostNotifications().add(postNotification);
        postRepos.save(post);

        authUser.getComments().add(comment);
        authUser.getPostNotificationsCreator().add(postNotification);
        usersRepos.save(authUser);

        receiver.getPostNotificationsReceiver().add(postNotification);
        usersRepos.save(receiver);

        return mapCommentToResponse(comment);
    }

    @Override
    public List<CommentResponse> getCommentsByParentComment(Long parentCommentId) {
        Comment parentComment = isCheckComment(parentCommentId);
        List<Comment> comments = commentRepos.findByParentComment(parentComment);
        List<CommentResponse> responses = comments.stream().map(comment -> mapCommentToResponse(comment)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        return responses;
    }

    @Override
    public List<CommentResponse> getCommentsByPost(Long postId) {
        Post post = isCheckPost(postId);
        List<Comment> comments = commentRepos.findByPost(post);
        List<CommentResponse> responses = comments.stream().map(comment -> mapCommentToResponse(comment)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        return responses;
    }
   

    private Post isCheckPost(Long postId) {
        Optional<Post> entity = postRepos.findById(postId);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the post not found");
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


    

    private CommentResponse mapCommentToResponse(Comment comment) {
        CommentResponse commentResponse = new CommentResponse(comment.getId(), comment.getContent(), comment.getNestedCommentCount(), comment.getCommentLikeCount(), mapUserToUserResponse(comment.getOwner()), mapPostToResponse(comment.getPost()), comment.getDateCreated());
        if(comment.getParentComment() != null) {
            commentResponse.setParentCommentId(comment.getParentComment().getId());
        }
        return commentResponse;
    }

    private Comment isCheckComment(Long id) {
        Optional<Comment> entity = commentRepos.findById(id);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the comment not found");
    }

    private PostResponse mapPostToResponse(Post post) {
        PostResponse postResponse = new PostResponse(post.getId(), post.getContent(), post.getDateCreated(), post.getDateUpdated(), post.getCommentCount(), post.getLikeCount(), mapUserToUserResponse(post.getOwner()));
        if( post.getImageUrls() != null && post.getImageUrls().size() > 0) {
            postResponse.getImageUrls().addAll(post.getImageUrls());
        }

        if(post.getTags() != null && post.getTags().size() > 0) {
            List<String> tagResponses = post.getTags().stream().map(tag -> tag.getContent()).collect(Collectors.toList());
            postResponse.setTags(tagResponses);
        }

        if(post.getPoll() != null) {
            Poll poll = post.getPoll();
            PollResponse pollResponse = new PollResponse(poll.getId(), poll.getQuestion(), poll.getExpireDays(), poll.getPost().getId());
            List<ChoiceResponse> choiceResponses = poll.getChoices().stream().map(choice -> mapChoiceToResponse(choice)).collect(Collectors.toList());
            pollResponse.setChoices(choiceResponses);
            postResponse.setPoll(pollResponse);
        }
        return postResponse;
        
    }

    private ChoiceResponse mapChoiceToResponse(Choice choice) {
        ChoiceResponse response = new ChoiceResponse(choice.getId(), choice.getAnswer(), choice.getVoteCount(), choice.getPoll().getId());
        return response;
    }
    
}
