package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Story;
import instagram.com.backend.Entity.StoryLike;
import instagram.com.backend.Entity.StoryNotification;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.StoryLikeResponse;
import instagram.com.backend.Entity.Response.StoryResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Repository.StoryLikeRepos;
import instagram.com.backend.Repository.StoryNotificationRepos;
import instagram.com.backend.Repository.StoryRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.StoryLikeService;
import instagram.com.backend.Service.StoryService;

@Service
public class StoryLikeServiceIml implements StoryLikeService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    StoryRepos storyRepos;
    @Autowired
    StoryLikeRepos storyLikeRepos;
    @Autowired
    StoryNotificationRepos storyNotificationRepos;

    @Override
    public List<StoryLikeResponse> getStoryLikeByStory(Long storyId) {
        Story story = isCheckStory(storyId);
        
        List<StoryLike> list = storyLikeRepos.findByStory(story); 
        list.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        
        List<StoryLikeResponse> responses = list.stream().map(like -> mapStoryLikeToResponse(like)).collect(Collectors.toList());

        return responses;
    }
    @Override
    public StoryLikeResponse likeStory(Long storyId) {
        Users authUser = getAuthUser();
        Story story = isCheckStory(storyId);
        Optional<StoryLike> entity = storyLikeRepos.findByOwnerAndStory(authUser, story);
        if(entity.isPresent()) {
            throw new EntityexistingException("the story like exist, cannot like the story twice");
        }
        StoryLike like = new StoryLike(authUser, story);
        storyLikeRepos.save(like);

        story.getStoryLikes().add(like);
        story.setLikeCount(story.getLikeCount() + 1);
        
        authUser.getStorieLikes().add(like);

        Users receiver = story.getOwner();
        StoryNotification notification = new StoryNotification(authUser, receiver, story);
        storyNotificationRepos.save(notification);

        authUser.getStoryNotificationsCreator().add(notification);
        receiver.getStoryNotificationsReceiver().add(notification);
        story.getStoryNotifications().add(notification);

        usersRepos.save(authUser);
        usersRepos.save(receiver);
        storyRepos.save(story);

        StoryLikeResponse response = mapStoryLikeToResponse(like);
        return response;
    }
    @Override
    public void removeLikeFromStory(Long storyId) {
        Users authUser = getAuthUser();
        Story story = isCheckStory(storyId);
        Optional<StoryLike> entity = storyLikeRepos.findByOwnerAndStory(authUser, story);
        StoryLike like = isCheckStoryLike(entity);

        authUser.getStorieLikes().remove(like);
        usersRepos.save(authUser);
        
        story.setLikeCount(story.getLikeCount() - 1);
        story.getStoryLikes().remove(like);
        storyRepos.save(story);

        storyLikeRepos.delete(like);

        
    }

     private Users isCheck(Optional<Users> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }
    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }

    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheck(entity);
        return user;
    }
    private StoryResponse mapStoryToResponse(Story story) {
        StoryResponse response = new StoryResponse(story.getId(), story.getLikeCount(), story.getDateCreated(), story.getImageUrls(), mapUserToUserResponse(story.getOwner()));
        return response;
    }

    private Story isCheckStory(Long storyId) {
        Optional<Story> entity = storyRepos.findById(storyId);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the story not found");
    }

    private StoryLikeResponse mapStoryLikeToResponse(StoryLike storyLike) {
        StoryLikeResponse response = new StoryLikeResponse(storyLike.getId(), storyLike.getDateCreated(), mapUserToUserResponse(storyLike.getOwner()), storyLike.getStory().getId());
        return response;
    }

    private StoryLike isCheckStoryLike(Optional<StoryLike> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the storyLike not found");
    }
}
