package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Request.PostRequest;
import instagram.com.backend.Entity.Response.PostResponse;

public interface PostService {
    //admin access
    List<PostResponse> getAllPost();
    //user Access
    List<PostResponse> getAllPostOfFollowings();
    //user access
    List<PostResponse> getPostByActiveOwner(Long activeOwnerId);
    //admin access
    List<PostResponse> getPostByOwnerForAdminAccess(Long activeOwnerId);
    // for authenticated user
    List<PostResponse> getPostByAuthUser();
    PostResponse getPostById(Long id);
    PostResponse savePost(PostRequest postreRequest);
    void deletePost(Long id);
    
}
