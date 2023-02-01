package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Request.CommentRequest;
import instagram.com.backend.Entity.Response.CommentResponse;

public interface CommentService {
    CommentResponse addCommentToPost(CommentRequest commentRequest);
    CommentResponse addCommentToParentComment(CommentRequest commentRequest);
    List<CommentResponse> getCommentsByPost(Long postId);
    List<CommentResponse> getCommentsByParentComment(Long parentCommentId);
}
