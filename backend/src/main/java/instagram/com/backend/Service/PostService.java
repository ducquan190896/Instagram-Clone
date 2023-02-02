package instagram.com.backend.Service;

import java.util.List;

import javax.transaction.Transactional;

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
    //user access
    List<PostResponse> getPostsByTag(String tagName);
    //user access
    List<PostResponse> getPostsBySearchContent(String content);
    //admin access
    List<PostResponse> getPostByOwnerForAdminAccess(Long activeOwnerId);
    // for authenticated user
    List<PostResponse> getPostByAuthUser();
    PostResponse getPostById(Long id);
    PostResponse savePost(PostRequest postreRequest);
    @Transactional
    void deletePost(Long id);
    
}
