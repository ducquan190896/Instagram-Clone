package instagram.com.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.PostNotification;

@Repository
public interface PostNotificationRepos extends JpaRepository<PostNotification, Long> {
    
}
