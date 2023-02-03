package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.StoryNotificationResponse;
import instagram.com.backend.Service.StoryNotificationService;

@RestController
@RequestMapping("/api/storyNotifications")
public class StoryNotificationController {
    @Autowired
    StoryNotificationService storyNotificationService;

    @GetMapping("/authReceiver/all")
    public ResponseEntity<List<StoryNotificationResponse>> getAllByAuthUser() {
        return new ResponseEntity<>(storyNotificationService.getStoryNotifiesByAuthReceiver(), HttpStatus.OK);
    }
}
