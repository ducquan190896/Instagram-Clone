package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import instagram.com.backend.Entity.Story;
import instagram.com.backend.Entity.StoryLike;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.StoryLikeResponse;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Mapper.StoryLikeMapper;
import instagram.com.backend.Repository.StoryLikeRepos;
import instagram.com.backend.Repository.StoryRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.StoryLikeService;
import instagram.com.backend.Service.UserService;

@Service
public class StoryLikeServiceIml implements StoryLikeService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    StoryRepos storyRepos;
    @Autowired
    StoryLikeRepos storyLikeRepos;
    @Autowired
    UserService userService;
    @Autowired
    StoryLikeMapper storyLikeMapper;

    @Override
    public List<StoryLikeResponse> getStoryLikeByStory(Long storyId) {
        Story story = isCheckStory(storyId);
        
        List<StoryLike> list = storyLikeRepos.findByStory(story); 
        list.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        
        List<StoryLikeResponse> responses = list.stream().map(like -> storyLikeMapper.mapStoryLikeToResponse(like)).collect(Collectors.toList());

        return responses;
    }
    @Override
    public StoryLikeResponse likeStory(Long storyId) {
        Users authUser = userService.getAuthUser();
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

        usersRepos.save(authUser);
        usersRepos.save(receiver);
        storyRepos.save(story);

        StoryLikeResponse response = storyLikeMapper.mapStoryLikeToResponse(like);
        return response;
    }
    @Override
    public void removeLikeFromStory(Long storyId) {
        Users authUser = userService.getAuthUser();
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
    
     @Override
    public boolean checkStoryLikeByAuthUser(Long storyId) {
        Users authUser = userService.getAuthUser();
        Story story = isCheckStory(storyId);
        Optional<StoryLike> entity = storyLikeRepos.findByOwnerAndStory(authUser, story);
        if(entity.isPresent()) {
            return true;
        } else {
            return false;
        }

    }

    private Story isCheckStory(Long storyId) {
        Optional<Story> entity = storyRepos.findById(storyId);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the story not found");
    }


    private StoryLike isCheckStoryLike(Optional<StoryLike> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFoundException("the storyLike not found");
    }
}
