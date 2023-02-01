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

import instagram.com.backend.Entity.Response.PostLikeResponse;
import instagram.com.backend.Service.PostLikeService;
import instagram.com.backend.Service.PostService;

@RestController
@RequestMapping("/api/postlikes")
public class PostLikeController {
    @Autowired
    PostLikeService postLikeService;

    @GetMapping("/getAllByPost/{postId}")
    public ResponseEntity<List<PostLikeResponse>> getAllByPost(@PathVariable Long postId) {
        return new ResponseEntity<List<PostLikeResponse>>(postLikeService.getPostLikesByPost(postId), HttpStatus.OK);
    }
    @PostMapping("/likePost/{postId}")
    public ResponseEntity<PostLikeResponse> likePost(@PathVariable Long postId) {
        return new ResponseEntity<PostLikeResponse>(postLikeService.likePost(postId), HttpStatus.CREATED);
    } 
    @DeleteMapping("/removeLikeFromPost/{postId}")
    public ResponseEntity<HttpStatus> removeLikeFromPost(@PathVariable Long postId) {
        postLikeService.removeLikeFromPost(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
