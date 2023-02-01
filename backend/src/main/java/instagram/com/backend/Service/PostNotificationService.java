package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.PostNotificationResponse;

public interface PostNotificationService {
    // get all post notification by auth user as a receiver
    List<PostNotificationResponse> getAllReceivedPostNotificationByAuth();
}
