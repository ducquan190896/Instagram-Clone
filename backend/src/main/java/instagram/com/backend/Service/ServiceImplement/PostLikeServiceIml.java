package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.PostLike;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.PostLikeResponse;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Mapper.PostLikeMapper;
import instagram.com.backend.Repository.PostLikeRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.PostLikeService;
import instagram.com.backend.Service.PostService;
import instagram.com.backend.Service.UserService;

@Service
public class PostLikeServiceIml implements PostLikeService {
    @Autowired
    PostLikeRepos postLikeRepos;
    @Autowired
    PostRepos postRepos;
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    UserService userService;
    @Autowired
    PostLikeMapper postLikeMapper;
    @Autowired
    PostService postService;


    @Override
    public List<PostLikeResponse> getPostLikesByPost(Long postId) {
        Post post = postService.isCheckPost(postId);
        List<PostLike> postLikes = postLikeRepos.findByPost(post);
        List<PostLikeResponse> responses = postLikes.stream().map(postlike -> postLikeMapper.mapPostLikeToResponse(postlike)).collect(Collectors.toList());
        return responses;
    }
    @Override
    public PostLikeResponse likePost(Long postId) {
        Users authUser = userService.getAuthUser();
        Post post = postService.isCheckPost(postId);
        Users receiver = post.getOwner();
        Optional<PostLike> entity = postLikeRepos.findByPostAndOwner(post, authUser);
        if(entity.isPresent()) {
            throw new EntityexistingException("the user already liked the post in the past, cannot like it one more time");
        }
        PostLike postLike = new PostLike(authUser, post);
        postLikeRepos.save(postLike);
        authUser.getPostLikes().add(postLike);
        post.getPostLikes().add(postLike);
        post.setLikeCount(post.getLikeCount() + 1);
        postRepos.save(post);
        PostLikeResponse postLikeResponse = postLikeMapper.mapPostLikeToResponse(postLike);
        return postLikeResponse;
    }
    @Override
    public void removeLikeFromPost(Long postId) {
        Users authUser = userService.getAuthUser();
        Post post = postService.isCheckPost(postId);
        Optional<PostLike> entity = postLikeRepos.findByPostAndOwner(post, authUser);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the post like not found, cannot remove post like");
        }
        PostLike postLike = entity.get();
        authUser.getPostLikes().remove(postLike);
        post.getPostLikes().remove(postLike);
        post.setLikeCount(post.getLikeCount() - 1);
        postRepos.save(post);
        usersRepos.save(authUser);
        postLikeRepos.delete(postLike);
    }
    
}
