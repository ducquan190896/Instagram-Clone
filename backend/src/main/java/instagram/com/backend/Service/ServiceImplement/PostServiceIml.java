package instagram.com.backend.Service.ServiceImplement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import instagram.com.backend.Entity.Choice;
import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Poll;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Tag;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Entity.Request.PostRequest;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Mapper.PostMapper;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.TagRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.PostService;
import instagram.com.backend.Service.UserService;

@Service
public class PostServiceIml implements PostService {
    @Autowired
    PostRepos postRepos;
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    FollowRepos followRepos;
    @Autowired
    TagRepos tagRepos;
    @Autowired
    PostMapper postMapper;
    @Autowired
    UserService userService;

    @Override
    public List<PostResponse> getAllPost() {
        List<Post> posts = postRepos.findAll();
       List<PostResponse> responses = posts.stream().map(pos -> postMapper.mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses;
    }
    @Override
    public List<PostResponse> getAllPostOfFollowings() {
       Users authUser = userService.getAuthUser();
       List<Post> postsOfFollowings = new ArrayList<>();
       List<Follow> followings = followRepos.findByFollowing(authUser);
       followings.stream().forEach(follow -> {
        Users follower = follow.getFollower();
        if(follower.getActive() == true) {
            List<Post> followerPosts = postRepos.findByOwner(follower);
            postsOfFollowings.addAll(followerPosts);
        }
       });

       List<PostResponse> responses = postsOfFollowings.stream().map(pos -> postMapper.mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 
    }
    @Override
    public List<PostResponse> getPostByActiveOwner(Long activeOwnerId) {
       Users owner = userService.isCheckUser(activeOwnerId);
       if(owner.getActive() == false) {
        return null;
       }
       List<Post> posts = postRepos.findByOwner(owner);
       
       List<PostResponse> responses = posts.stream().map(pos -> postMapper.mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 

    }

 //fix it   

    @Override
    public List<PostResponse> getPostsByTag(String tagName) {
        // Optional<Tag> entity = tagRepos.findByContent(tagName);
        // if(!entity.isPresent()) {
        //     throw new EntityNotFoundException("the tag not found");
        // }
        // Tag tag = entity.get();
        List<Tag> tags = tagRepos.findByContentContaining(tagName);
       
        // List<Post> posts = postRepos.findByTags(tagName);
        List<Post> posts = new ArrayList<>();

        tags.stream().forEach(tag -> {
            List<Post> postTag = postRepos.findByTags(tag.getContent());
            posts.addAll(postTag);
        });
        
        List<PostResponse> responses = posts.stream().map(pos -> postMapper.mapPostToResponse(pos)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
        return responses;
    }

    


    @Override
    public List<PostResponse> getPostsBySearchContent(String content) {
        List<Post> posts = postRepos.findByContentContainingAndActiveUser(content, true);
        
        List<PostResponse> responses = posts.stream().map(pos -> postMapper.mapPostToResponse(pos)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
        return responses;
    }


    @Override
    public List<PostResponse> getPostByOwnerForAdminAccess(Long activeOwnerId) {
       Users owner = userService.isCheckUser(activeOwnerId);
       List<Post> posts = postRepos.findByOwner(owner);
       List<PostResponse> responses = posts.stream().map(pos -> postMapper.mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 

    }
    @Override
    public PostResponse getPostById(Long id) {
        Post post = isCheckPost(id);
        return postMapper.mapPostToResponse(post);
    }
    @Override
    public List<PostResponse> getPostByAuthUser() {
       Users authUser = userService.getAuthUser();
       List<Post> posts = postRepos.findByOwner(authUser);
       List<PostResponse> responses = posts.stream().map(pos -> postMapper.mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses;
    }

    

    @Override
    public void deletePost(Long id) {
        Users authUser = userService.getAuthUser();
        Post post = isCheckPost(id);
        if(authUser.getRole().equals(Role.ADMIN) || authUser.getId() == post.getOwner().getId()) {
            Users user = post.getOwner();
            user.getPosts().remove(post);
            user.setPostCounts(user.getPostCounts() - 1);
            if(post.getTags() != null && post.getTags().size() > 0) {
                post.getTags().stream().forEach(tag -> {
                    tag.removeTagFromPost(post);
                    tagRepos.save(tag);
                });
            }

            postRepos.delete(post);
            usersRepos.save(user);
        } else {
            throw new BadResultException("unauthorized to delete post");
        }
        
    }
    @Override
    public PostResponse savePost(PostRequest postRequest) {
        Users authUser = userService.getAuthUser();
        Post post = new Post(postRequest.getContent(), postRequest.getImageUrls(), authUser);
        postRepos.save(post);
        if(postRequest.getTags() != null && postRequest.getTags().size() > 0) {
            // List<Tag> tags = mapRequestToTag(postRequest.getTags(), post);
             mapRequestToTag(postRequest.getTags(), post);
            
        }    
        postRepos.save(post);
        authUser.getPosts().add(post);
        authUser.setPostCounts(authUser.getPostCounts() + 1);
        usersRepos.save(authUser);
        return postMapper.mapPostToResponse(post);
    }
    
    @Override
    public PostResponse savePostWithPoll(PostRequest postRequest) {
        if(postRequest.getPoll() == null) {
            throw new BadResultException("the post has not poll, fail to create a post with polling feature");
        }
        Users authUser = userService.getAuthUser();

        // creating poll
        Poll poll = new Poll(postRequest.getPoll().getQuestion(), postRequest.getPoll().getExpireDays());
        postRequest.getPoll().getChoices().stream().forEach(choiceReq -> {
            Choice choice = new Choice(choiceReq);
            poll.addChoiceToPost(choice);
        });


        Post post = new Post(postRequest.getContent(), authUser, poll);
        poll.setPost(post);
        postRepos.save(post);
        if(postRequest.getTags() != null && postRequest.getTags().size() > 0) {
            // List<Tag> tags = mapRequestToTag(postRequest.getTags(), post);
             mapRequestToTag(postRequest.getTags(), post);
            
        }
        
        postRepos.save(post);
        authUser.getPosts().add(post);
        authUser.setPostCounts(authUser.getPostCounts() + 1);
        usersRepos.save(authUser);
        PostResponse response = postMapper.mapPostToResponse(post);
        return response;
    }

    @Override
    public Post isCheckPost(Long postId) {
        Optional<Post> entity = postRepos.findById(postId);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the post not found");
    }

    private void mapRequestToTag(List<String> tagRequests, Post post) {
        // List<Tag> tags = new ArrayList<>();
        tagRequests.stream().forEach(request -> {
            Optional<Tag> entity = tagRepos.findByContent(request);
            if(entity.isPresent()) {
              Tag tag = entity.get();         
              tag.addTagToPost(post);
            //   tags.add(tag);
              tagRepos.save(tag);

            } else {
                Tag tag = new Tag(request);                
                tag.addTagToPost(post);
                // tags.add(tag);
                tagRepos.save(tag);

            }
            
        });
        // return tags;
    } 
}
