package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.PostLikeResponse;

public interface PostLikeService {
    PostLikeResponse likePost(Long postId);
    void removeLikeFromPost(Long postId);
    List<PostLikeResponse> getPostLikesByPost(Long postId);
}
