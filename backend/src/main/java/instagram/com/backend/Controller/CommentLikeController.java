package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.CommentLikeResponse;
import instagram.com.backend.Service.CommentLikeService;

@RestController
@RequestMapping("/api/commentLike")
public class CommentLikeController {
    @Autowired
    CommentLikeService commentLikeService;

    @GetMapping("/allByComment/{commentId}")
    public ResponseEntity<List<CommentLikeResponse>> getAllByComment(@PathVariable Long commentId) {
        return new ResponseEntity<List<CommentLikeResponse>>(commentLikeService.getCommentLikesByComment(commentId), HttpStatus.OK);
    }

    @PostMapping("/likeComment/comment/{commentId}/post/{postId}")
    public ResponseEntity<CommentLikeResponse> likeComment(@PathVariable Long commentId, @PathVariable Long postId) {
        return new ResponseEntity<CommentLikeResponse>(commentLikeService.likeComment(postId, commentId), HttpStatus.CREATED);
    }

    @DeleteMapping("/removeLikeFromComment/comment/{commentId}")
    public ResponseEntity<HttpStatus> removeLikeFromComment(@PathVariable Long commentId) {
        commentLikeService.removeLikeFromComment(commentId);
        return new ResponseEntity<HttpStatus>( HttpStatus.NO_CONTENT);
    }
}
