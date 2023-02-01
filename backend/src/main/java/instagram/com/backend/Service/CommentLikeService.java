package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.CommentLikeResponse;

public interface CommentLikeService {
    CommentLikeResponse likeComment(Long postId, Long commentId);
    void removeLikeFromComment(Long commentId);
    List<CommentLikeResponse> getCommentLikesByComment(Long commentId);
}
