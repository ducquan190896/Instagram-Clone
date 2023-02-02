package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.FollowNotificationResponse;
import instagram.com.backend.Service.FollowNotificationService;

@RestController
@RequestMapping("/api/followNotification")
public class FollowNotificationController {
    @Autowired
    FollowNotificationService followNotificationService;

    @GetMapping("/allByAuthUser")
    public ResponseEntity<List<FollowNotificationResponse>> getAll() {
        return new ResponseEntity<List<FollowNotificationResponse>>(followNotificationService.getAllByAuthReceiver(), HttpStatus.OK);
    }
}
