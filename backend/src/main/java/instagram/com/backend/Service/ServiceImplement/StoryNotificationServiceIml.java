package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Story;
import instagram.com.backend.Entity.StoryNotification;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.StoryNotificationResponse;
import instagram.com.backend.Entity.Response.StoryResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.StoryNotificationRepos;
import instagram.com.backend.Repository.StoryRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.StoryNotificationService;

@Service
public class StoryNotificationServiceIml implements StoryNotificationService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    StoryRepos storyRepos;
    @Autowired
    StoryNotificationRepos storyNotificationRepos;


    @Override
    public List<StoryNotificationResponse> getStoryNotifiesByAuthReceiver() {
        Users authUser = getAuthUser();
        List<StoryNotification> list = storyNotificationRepos.findByReceiver(authUser);
        list.sort((a, b) -> a.getDateCreated().compareTo(b.getDateCreated()));
        
        List<StoryNotificationResponse> responses = list.stream().map(notify -> mapStoryNotificationToResponse(notify)).collect(Collectors.toList());
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

    private StoryNotificationResponse mapStoryNotificationToResponse(StoryNotification notify) {
        StoryNotificationResponse response = new StoryNotificationResponse(notify.getId(), notify.getType(), notify.getDateCreated(), mapUserToUserResponse(notify.getCreator()), mapUserToUserResponse(notify.getReceiver()), mapStoryToResponse(notify.getStory()));
        return response;
    }
}
