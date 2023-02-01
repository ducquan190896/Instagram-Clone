package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.CommentNotification;
import instagram.com.backend.Entity.Users;

@Repository
public interface CommentNotificationRepos extends JpaRepository<CommentNotification, Long> {
    List<CommentNotification> findByReceiver(Users receiver);
}
