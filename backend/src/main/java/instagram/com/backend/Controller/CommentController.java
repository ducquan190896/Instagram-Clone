package instagram.com.backend.Controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Request.CommentRequest;
import instagram.com.backend.Entity.Response.CommentResponse;
import instagram.com.backend.Service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    CommentService commentService;

    @PostMapping("/addCommentToPost")
    public ResponseEntity<CommentResponse> addCommentToPost(@Valid @RequestBody CommentRequest commentRequest) {
        return new ResponseEntity<>(commentService.addCommentToPost(commentRequest), HttpStatus.CREATED);
    }
    
    @PostMapping("/addCommentToParentComment")
    public ResponseEntity<CommentResponse> addCommentToParentComment(@Valid @RequestBody CommentRequest commentRequest) {
        return new ResponseEntity<>(commentService.addCommentToParentComment(commentRequest), HttpStatus.CREATED);
    }

    // can be accessed by anyone without authentication
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPost(@PathVariable Long postId) {
        return new ResponseEntity<List<CommentResponse>>(commentService.getCommentsByPost(postId), HttpStatus.OK);
    }
    // can be accessed by anyone without authentication
    @GetMapping("/parentComment/{parentCommentId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByParentComment(@PathVariable Long parentCommentId) {
        return new ResponseEntity<List<CommentResponse>>(commentService.getCommentsByParentComment(parentCommentId), HttpStatus.OK);
    }
}
