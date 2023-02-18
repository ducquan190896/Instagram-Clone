package instagram.com.backend.Service.ServiceImplement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Story;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Request.StoryRequest;
import instagram.com.backend.Entity.Response.StoryResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.StoryRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.StoryService;

@Service
public class StoryServiceIml implements StoryService {

    @Autowired
    UsersRepos usersRepos;
    @Autowired
    StoryRepos storyRepos;
    @Autowired
    FollowRepos followreRepos;

    @Override
    public StoryResponse createStory(StoryRequest storyRequest) {
        Users authUser = getAuthUser();
        Story story = new Story(storyRequest.getImageUrls(), authUser);
        storyRepos.save(story);
        authUser.getStories().add(story);
        usersRepos.save(authUser);
        StoryResponse response = mapStoryToResponse(story);
        return response;
    }
    @Override
    public void deleteStory(Long storyId) {
        Users authUser = getAuthUser();
        Optional<Story> entity = storyRepos.findById(storyId);

        if(!entity.isPresent()) {
            throw new EntityNotFountException("the story not found");
        }

        Story story = entity.get();
        if(authUser.getId() != story.getOwner().getId()) {
            throw new BadResultException("unauthorized to delete the story");
        }
        authUser.getStories().remove(story);
        usersRepos.save(authUser);
        storyRepos.delete(story);
        
    }
    

    @Override
    public StoryResponse getStoryById(Long storyid) {
        
        Optional<Story> entity = storyRepos.findById(storyid);

        if(!entity.isPresent()) {
            throw new EntityNotFountException("the story not found");
        }

        Story story = entity.get();
        StoryResponse response = mapStoryToResponse(story);
        return response;
    }

    @Override
    public List<StoryResponse> getStories() {
        List<Story> list = storyRepos.findAll(Sort.by("dateCreated").descending());
        List<StoryResponse> responses = list.stream().map(story -> mapStoryToResponse(story)).collect(Collectors.toList());
        return responses;
    }

    @Override
    public List<StoryResponse> getStoriesByActiveOwner(Long ownerId) {
        List<Story> list = storyRepos.findByActiveOwner(ownerId, true);
        System.out.println(list);

        List<StoryResponse> responses = list.stream().map(story -> mapStoryToResponse(story)).collect(Collectors.toList());
        return responses;
    }

    @Override
    public List<StoryResponse> getStoriesOfFollowings() {
        Users authUser = getAuthUser();
        List<Follow> followings = followreRepos.findByFollowing(authUser);
        List<Long> followingIds = followings.stream().map(follow -> follow.getFollower().getId()).collect(Collectors.toList());
        
        List<Story> largeStories = new ArrayList<>();

        List<Story> stories = storyRepos.findByActiveFollowings(followingIds, true);

        List<Story> storiesAuthUser = storyRepos.findByOwnerId(authUser.getId());
        largeStories.addAll(storiesAuthUser);
        largeStories.addAll(stories);

        //check the creation expiry of story with 24h
        LocalDateTime currentTime = LocalDateTime.now();
        List<Story> storiesFilter = largeStories.stream().filter(story -> {
            
            if(story.getDateCreated().plusDays(2).isAfter(currentTime)) {
                return true;
            } else {
                return false;
            }

        }).collect(Collectors.toList());

        List<StoryResponse> responses = storiesFilter.stream().map(story -> mapStoryToResponse(story)).collect(Collectors.toList());
        return responses;
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
}
