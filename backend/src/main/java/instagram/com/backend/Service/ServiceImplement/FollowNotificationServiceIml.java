package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.FollowNotification;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.FollowNotificationResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.FollowNotificationRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.FollowNotificationService;

@Service
public class FollowNotificationServiceIml implements FollowNotificationService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    FollowNotificationRepos followNotificationRepos;

    @Override
    public List<FollowNotificationResponse> getAllByAuthReceiver() {
        Users authUser = getAuthUser();
        List<FollowNotification> list = followNotificationRepos.findByReceiver(authUser);
        List<FollowNotificationResponse> responses = list.stream().map(follow -> mapFollowNotificationToResponse(follow)).collect(Collectors.toList());
        return responses;
    }

    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
       
    }

    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }
    private FollowNotificationResponse mapFollowNotificationToResponse(FollowNotification followNotification) {
        FollowNotificationResponse response = new FollowNotificationResponse(followNotification.getId(), mapUserToUserResponse(followNotification.getCreator()), mapUserToUserResponse(followNotification.getReceiver()), followNotification.getDateCreated());
        return response;
    }
}
