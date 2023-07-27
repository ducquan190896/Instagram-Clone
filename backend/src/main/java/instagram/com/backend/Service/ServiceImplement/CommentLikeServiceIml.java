package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import instagram.com.backend.Entity.Comment;
import instagram.com.backend.Entity.CommentLike;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.CommentLikeResponse;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Mapper.CommentLikeMapper;
import instagram.com.backend.Repository.CommentLikeRepos;
import instagram.com.backend.Repository.CommentRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.CommentLikeService;
import instagram.com.backend.Service.CommentService;
import instagram.com.backend.Service.PostService;
import instagram.com.backend.Service.UserService;

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
    UserService userService;
    @Autowired
    CommentLikeMapper commentLikeMapper;
    @Autowired
    PostService postService;
    @Autowired
    CommentService commentService;


    @Override
    public List<CommentLikeResponse> getCommentLikesByComment(Long commentId) {
        Comment comment = commentService.isCheckComment(commentId);
        List<CommentLike> commentLikes = commentLikeRepos.findByComment(comment);
        List<CommentLikeResponse> responses = commentLikes.stream().map(like -> commentLikeMapper.mapCommentLikeToResponse(like)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        return responses;
    }

    @Override
    public boolean checkCommentLikeStatus(long commentId) {
        Users authUser = userService.getAuthUser();
        Comment comment = commentService.isCheckComment(commentId);
        Optional<CommentLike> entity = commentLikeRepos.findByOwnerAndComment(authUser, comment);
        if(entity.isPresent()) {
            return true;
        }
        return false;
    }

    @Override
    public CommentLikeResponse likeComment(Long postId, Long commentId) {
        Users authUser = userService.getAuthUser();
        Comment comment = commentService.isCheckComment(commentId);
        Post post = postService.isCheckPost(postId);
        Users receiver = comment.getOwner();
        Optional<CommentLike> entity = commentLikeRepos.findByOwnerAndComment(authUser, comment);
        if(entity.isPresent()) {
            throw new EntityexistingException("the auth user already like the comment, cannot like twice");
        }

        CommentLike commentLike = new CommentLike(authUser, post, comment);
        commentLikeRepos.save(commentLike);
        
        //update comment
        comment.setCommentLikeCount(comment.getCommentLikeCount() + 1);
        comment.getCommentLikes().add(commentLike);
        commentRepos.save(comment);

        //update post
        post.getCommentLikes().add(commentLike);
        postRepos.save(post);
        
        //update authUser
        authUser.getCommentLikes().add(commentLike);
        usersRepos.save(authUser);

        //update receiver
        receiver.getCommentLikes().add(commentLike);
        usersRepos.save(receiver);

        CommentLikeResponse response = commentLikeMapper.mapCommentLikeToResponse(commentLike);
        return response;
    }


    @Override
    public void removeLikeFromComment(Long commentId) {
        Users authUser = userService.getAuthUser();
        Comment comment = commentService.isCheckComment(commentId);
        CommentLike commentLike = isCheckCommentLike(comment, authUser);

        //update comment
        comment.getCommentLikes().remove(commentLike);
        comment.setCommentLikeCount(comment.getCommentLikeCount() - 1);
        commentRepos.save(comment);

        commentLikeRepos.delete(commentLike);
    }

   
    private CommentLike isCheckCommentLike(Comment comment, Users user) {
        Optional<CommentLike> entity = commentLikeRepos.findByOwnerAndComment(user, comment);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the comment like not found");
    }

}
