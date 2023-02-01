package instagram.com.backend.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.CommentNotificationResponse;
import instagram.com.backend.Entity.Response.PostNotificationResponse;
import instagram.com.backend.Service.CommentNotificationService;
import instagram.com.backend.Service.PostNotificationService;

@RestController
@RequestMapping("/api/commentNotifications")
public class CommentNotificationController {
    
    @Autowired
    CommentNotificationService commentNotificationService;

    @GetMapping("/allForAuthUser")
    public ResponseEntity<List<CommentNotificationResponse>> getAllForAuthUser() {
        return new ResponseEntity<List<CommentNotificationResponse>>(commentNotificationService.getCommentNotificationByAuthUser(), HttpStatus.OK);
    }
}
