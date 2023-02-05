package instagram.com.backend.Service.ServiceImplement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Choice;
import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Poll;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Tag;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Entity.Request.PostRequest;
import instagram.com.backend.Entity.Response.ChoiceResponse;
import instagram.com.backend.Entity.Response.PollResponse;
import instagram.com.backend.Entity.Response.PostResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.TagRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.PostService;

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

    @Override
    public List<PostResponse> getAllPost() {
        List<Post> posts = postRepos.findAll();
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses;
    }
    @Override
    public List<PostResponse> getAllPostOfFollowings() {
       Users authUser = getAuthUser();
       List<Post> postsOfFollowings = new ArrayList<>();
       List<Follow> followings = followRepos.findByFollowing(authUser);
       followings.stream().forEach(follow -> {
        Users follower = follow.getFollower();
        if(follower.getActive() == true) {
            List<Post> followerPosts = postRepos.findByOwner(follower);
            postsOfFollowings.addAll(followerPosts);
        }
       });

       List<PostResponse> responses = postsOfFollowings.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 
    }
    @Override
    public List<PostResponse> getPostByActiveOwner(Long activeOwnerId) {
       Optional<Users> entity = usersRepos.findById(activeOwnerId);
       
       Users owner = isCheckUser(entity);
       if(owner.getActive() == false) {
        return null;
       }
       List<Post> posts = postRepos.findByOwner(owner);
       
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 

    }

 //fix it   

    @Override
    public List<PostResponse> getPostsByTag(String tagName) {
        Optional<Tag> entity = tagRepos.findByContent(tagName);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the tag not found");
        }
        Tag tag = entity.get();
        List<Post> posts = postRepos.findByTags(tagName);
        
        List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
        return responses;
    }

    


    @Override
    public List<PostResponse> getPostsBySearchContent(String content) {
        List<Post> posts = postRepos.findByContentContainingAndActiveUser(content, true);
        
        List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
        responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
        return responses;
    }


    @Override
    public List<PostResponse> getPostByOwnerForAdminAccess(Long activeOwnerId) {
        Optional<Users> entity = usersRepos.findById(activeOwnerId);
       
       Users owner = isCheckUser(entity);
       List<Post> posts = postRepos.findByOwner(owner);
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses; 

    }
    @Override
    public PostResponse getPostById(Long id) {
        Optional<Post> entity = postRepos.findById(id);
        Post post = isCheckPost(entity);
        return mapPostToResponse(post);
    }
    @Override
    public List<PostResponse> getPostByAuthUser() {
       Users authUser = getAuthUser();
       List<Post> posts = postRepos.findByOwner(authUser);
       List<PostResponse> responses = posts.stream().map(pos -> mapPostToResponse(pos)).collect(Collectors.toList());
       responses.sort((a, b) -> a.getDateUpdated().compareTo(b.getDateUpdated()));
       return responses;
    }

    

    @Override
    public void deletePost(Long id) {
        Users authUser = getAuthUser();
        Optional<Post> entity = postRepos.findById(id);
        Post post = isCheckPost(entity);
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
        Users authUser = getAuthUser();
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
        return mapPostToResponse(post);

    }


    
    @Override
    public PostResponse savePostWithPoll(PostRequest postRequest) {
        if(postRequest.getPoll() == null) {
            throw new BadResultException("the post has not poll, fail to create a post with polling feature");
        }
        Users authUser = getAuthUser();

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
        PostResponse response = mapPostToResponse(post);
        return response;
    }


    private PostResponse mapPostToResponse(Post post) {
        PostResponse postResponse = new PostResponse(post.getId(), post.getContent(), post.getDateCreated(), post.getDateUpdated(), post.getCommentCount(), post.getLikeCount(), mapUserToUserResponse(post.getOwner()));
        if( post.getImageUrls() != null && post.getImageUrls().size() > 0) {
            postResponse.getImageUrls().addAll(post.getImageUrls());
        }

        if(post.getTags() != null && post.getTags().size() > 0) {
            List<String> tagResponses = post.getTags().stream().map(tag -> tag.getContent()).collect(Collectors.toList());
            postResponse.setTags(tagResponses);
        }

        if(post.getPoll() != null) {
            Poll poll = post.getPoll();
            PollResponse pollResponse = new PollResponse(poll.getId(), poll.getQuestion(), poll.getExpireDays(), poll.getPost().getId());
            List<ChoiceResponse> choiceResponses = poll.getChoices().stream().map(choice -> mapChoiceToResponse(choice)).collect(Collectors.toList());
            pollResponse.setChoices(choiceResponses);
            postResponse.setPoll(pollResponse);
        }
        return postResponse;
        
    }

    private ChoiceResponse mapChoiceToResponse(Choice choice) {
        ChoiceResponse response = new ChoiceResponse(choice.getId(), choice.getAnswer(), choice.getVoteCount(), choice.getPoll().getId());
        return response;
    }
 
    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }
    private Users isCheckUser(Optional<Users> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }

    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheckUser(entity);
        return user;
    }

    private Post isCheckPost(Optional<Post> entity) {
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
