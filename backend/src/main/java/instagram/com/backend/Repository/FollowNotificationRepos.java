package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.FollowNotification;
import instagram.com.backend.Entity.Users;

@Repository
public interface FollowNotificationRepos extends JpaRepository<FollowNotification, Long> {
    List<FollowNotification> findByReceiver(Users receiver);
}
