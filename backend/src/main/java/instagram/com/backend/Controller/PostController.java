package instagram.com.backend.Controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Request.PostRequest;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    PostService postService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<List<PostResponse>> getAllForAdmin() {
        return new ResponseEntity<List<PostResponse>>(postService.getAllPost(), HttpStatus.OK);
    }

    @GetMapping("/user/allPostOfFollowings")
    public ResponseEntity<List<PostResponse>> getAllOfFollowingsForUser() {
        return new ResponseEntity<List<PostResponse>>(postService.getAllPostOfFollowings(), HttpStatus.OK);
    }

    @GetMapping("/user/allPostOfActiveUser/{activeOwnerId}")
    public ResponseEntity<List<PostResponse>> getPostByActiveOwner(@PathVariable Long activeOwnerId) {
        return new ResponseEntity<List<PostResponse>>(postService.getPostByActiveOwner(activeOwnerId), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/allPostOfUser/{ownerId}")
    public ResponseEntity<List<PostResponse>> getPostByOwnerForAdminAccess(@PathVariable Long ownerId) {
        return new ResponseEntity<List<PostResponse>>(postService.getPostByOwnerForAdminAccess(ownerId), HttpStatus.OK);
    }

    @GetMapping("/user/postsOfAuthUser")
    public ResponseEntity<List<PostResponse>> getAllOfAuthUser() {
        return new ResponseEntity<List<PostResponse>>(postService.getPostByAuthUser(), HttpStatus.OK);
    }

    @GetMapping("/user/post/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {
        return new ResponseEntity<PostResponse>(postService.getPostById(postId), HttpStatus.OK);
    }
    @PostMapping("/savePost")
    public ResponseEntity<PostResponse> savePost(@Valid @RequestBody PostRequest postRequest) {
        return new ResponseEntity<PostResponse>(postService.savePost(postRequest), HttpStatus.CREATED);
    }
    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<HttpStatus> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return new ResponseEntity<HttpStatus>( HttpStatus.CREATED);
    }
}
