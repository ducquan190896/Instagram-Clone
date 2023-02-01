package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.PostNotificationResponse;
import instagram.com.backend.Service.PostNotificationService;

@RestController
@RequestMapping("/api/postNotifications")
public class PostNotificationController {
    @Autowired
    PostNotificationService postNotificationService;

    @GetMapping("/allForAuthUser")
    public ResponseEntity<List<PostNotificationResponse>> getAllForAuthUser() {
        return new ResponseEntity<List<PostNotificationResponse>>(postNotificationService.getAllReceivedPostNotificationByAuth(), HttpStatus.OK);
    }
}
