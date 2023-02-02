package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.FollowNotificationResponse;

public interface FollowNotificationService {
    List<FollowNotificationResponse> getAllByAuthReceiver();
}
