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
import instagram.com.backend.Entity.CommentLike;
import instagram.com.backend.Entity.CommentNotification;
import instagram.com.backend.Entity.Poll;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.CommentNotificationType;
import instagram.com.backend.Entity.Response.ChoiceResponse;
import instagram.com.backend.Entity.Response.CommentLikeResponse;
import instagram.com.backend.Entity.Response.CommentResponse;
import instagram.com.backend.Entity.Response.PollResponse;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Repository.CommentLikeRepos;
import instagram.com.backend.Repository.CommentNotificationRepos;
import instagram.com.backend.Repository.CommentRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.CommentLikeService;

@Service
public class CommentLikeServiceIml implements CommentLikeService {
    @Autowired
    CommentLikeRepos commentLikeRepos;
    @Autowired
    CommentRepos commentRepos;
    @Autowired
    PostRepos postRepos;
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    CommentNotificationRepos commentNotificationRepos;


    @Override
    public List<CommentLikeResponse> getCommentLikesByComment(Long commentId) {
        
        Comment comment = isCheckComment(commentId);
        List<CommentLike> commentLikes = commentLikeRepos.findByComment(comment);
        List<CommentLikeResponse> responses = commentLikes.stream().map(like -> mapCommentLikeToResponse(like)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        return responses;
    }

    @Override
    public CommentLikeResponse likeComment(Long postId, Long commentId) {
        Users authUser = getAuthUser();
        Comment comment = isCheckComment(commentId);
        Post post = isCheckPost(postId);
        Users receiver = comment.getOwner();
        Optional<CommentLike> entity = commentLikeRepos.findByOwnerAndComment(authUser, comment);
        if(entity.isPresent()) {
            throw new EntityexistingException("the auth user already like the comment, cannot like twice");
        }

        CommentLike commentLike = new CommentLike(authUser, post, comment);
        commentLikeRepos.save(commentLike);


        //create notification
        CommentNotification notification = new CommentNotification(CommentNotificationType.COMMENT_LIKE, authUser, receiver, post, comment);
        commentNotificationRepos.save(notification);
      

        //update comment
        comment.setCommentLikeCount(comment.getCommentLikeCount() + 1);
        comment.getCommentLikes().add(commentLike);
        comment.getCommentNotifications().add(notification);
        commentRepos.save(comment);

        //update post
        post.getCommentLikes().add(commentLike);
        post.getCommentNotifications().add(notification);
        postRepos.save(post);
        
        //update authUser
        authUser.getCommentLikes().add(commentLike);
        authUser.getCommentNotificationsCreator().add(notification);
        usersRepos.save(authUser);

        //update receiver
        receiver.getCommentLikes().add(commentLike);
        receiver.getCommentNotificationsReceiver().add(notification);
        usersRepos.save(receiver);

        CommentLikeResponse response = mapCommentLikeToResponse(commentLike);
        return response;
    }


    @Override
    public void removeLikeFromComment(Long commentId) {
        Users authUser = getAuthUser();
        Comment comment = isCheckComment(commentId);
        CommentLike commentLike = isCheckCommentLike(comment, authUser);

        //update comment
        comment.getCommentLikes().remove(commentLike);
        comment.setCommentLikeCount(comment.getCommentLikeCount() - 1);
        commentRepos.save(comment);

        commentLikeRepos.delete(commentLike);
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

    private CommentLike isCheckCommentLike(Comment comment, Users user) {
        Optional<CommentLike> entity = commentLikeRepos.findByOwnerAndComment(user, comment);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the comment like not found");
    }

    private CommentLikeResponse mapCommentLikeToResponse(CommentLike commentLike) {
        CommentLikeResponse response = new CommentLikeResponse(commentLike.getId(), mapUserToUserResponse(commentLike.getOwner()), commentLike.getPost().getId(), commentLike.getComment().getId(), commentLike.getDateCreated());
        return response;
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
