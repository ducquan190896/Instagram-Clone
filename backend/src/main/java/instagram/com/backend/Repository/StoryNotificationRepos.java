package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.StoryNotification;
import instagram.com.backend.Entity.Users;

@Repository
public interface StoryNotificationRepos extends JpaRepository<StoryNotification, Long> {
    List<StoryNotification> findByReceiver(Users receiver);
}
