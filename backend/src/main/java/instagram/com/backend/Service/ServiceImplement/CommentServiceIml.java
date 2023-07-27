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
import instagram.com.backend.Entity.Poll;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Request.CommentRequest;
import instagram.com.backend.Entity.Response.ChoiceResponse;
import instagram.com.backend.Entity.Response.CommentResponse;
import instagram.com.backend.Entity.Response.PollResponse;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Mapper.CommentMapper;
import instagram.com.backend.Mapper.UserMapper;
import instagram.com.backend.Repository.CommentRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.CommentService;
import instagram.com.backend.Service.PostService;
import instagram.com.backend.Service.UserService;

@Service
public class CommentServiceIml implements CommentService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    PostRepos postRepos;
    @Autowired
    CommentRepos commentRepos;
    @Autowired
    CommentMapper commentMapper;
    @Autowired
    UserService userService;
    @Autowired
    PostService postService;
 

    @Override
    public CommentResponse addCommentToParentComment(CommentRequest commentRequest) {
        Users authUser = userService.getAuthUser();
        Post post = postService.isCheckPost(commentRequest.getPostId());
        Comment comment = new Comment(commentRequest.getContent(), authUser, post);

        //add child comment to parent comment
        Comment parentComment = isCheckComment(commentRequest.getParentCommentId());
        comment.addCommentToParentComment(parentComment);
        commentRepos.save(comment);
        
        Users postReceiver = post.getOwner();
        Users commentReceiver =  parentComment.getOwner();

        commentRepos.save(parentComment);

        post.setCommentCount(post.getCommentCount() + 1);
        post.getComments().add(comment);
        postRepos.save(post);

        authUser.getComments().add(comment);
        usersRepos.save(authUser);

        usersRepos.save(postReceiver);

        usersRepos.save(commentReceiver);


        return commentMapper.mapCommentToResponse(comment);
    }

    @Override
    public CommentResponse addCommentToPost(CommentRequest commentRequest) {
        Users authUser = userService.getAuthUser();
        Post post = postService.isCheckPost(commentRequest.getPostId());
        Comment comment = new Comment(commentRequest.getContent(), authUser, post);
        commentRepos.save(comment);      

        Users receiver = post.getOwner();

        post.setCommentCount(post.getCommentCount() + 1);
        post.getComments().add(comment);
        postRepos.save(post);

        authUser.getComments().add(comment);
        usersRepos.save(authUser);
        usersRepos.save(receiver);

        return commentMapper.mapCommentToResponse(comment);
    }

    @Override
    public List<CommentResponse> getCommentsByParentComment(Long parentCommentId) {
        Comment parentComment = isCheckComment(parentCommentId);
        List<Comment> comments = commentRepos.findByParentComment(parentComment);
        List<CommentResponse> responses = comments.stream().map(comment -> commentMapper.mapCommentToResponse(comment)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        return responses;
    }

    @Override
    public List<CommentResponse> getCommentsByPost(Long postId) {
        Post post = postService.isCheckPost(postId);
        List<Comment> comments = commentRepos.findByPost(post);
        List<CommentResponse> responses = comments.stream().map(comment -> commentMapper.mapCommentToResponse(comment)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        return responses;
    }
    

    @Override
    public CommentResponse getCommentById(Long commentId) {
        Optional<Comment> entity = commentRepos.findById(commentId);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the comment not found");
        }
        Comment comment = entity.get();
        return commentMapper.mapCommentToResponse(comment);
    }

    @Override
    public Comment isCheckComment(Long id) {
        Optional<Comment> entity = commentRepos.findById(id);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the comment not found");
    }

  
    
}
