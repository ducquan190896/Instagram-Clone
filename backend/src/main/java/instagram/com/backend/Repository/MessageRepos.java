package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.Message;

@Repository
public interface MessageRepos extends JpaRepository<Message, Long> {
    
    List<Message> findByChat(Chat chat);
}
