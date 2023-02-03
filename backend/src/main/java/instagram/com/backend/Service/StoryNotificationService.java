package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.StoryNotificationResponse;

public interface StoryNotificationService {
    List<StoryNotificationResponse> getStoryNotifiesByAuthReceiver();
}
