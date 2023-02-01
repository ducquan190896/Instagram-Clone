package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.CommentNotificationResponse;

public interface CommentNotificationService {
    List<CommentNotificationResponse> getCommentNotificationByAuthUser();
}
