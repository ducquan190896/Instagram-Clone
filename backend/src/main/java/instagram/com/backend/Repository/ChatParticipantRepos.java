package instagram.com.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.ChatParticipant;
import instagram.com.backend.Entity.Users;

@Repository
public interface ChatParticipantRepos extends JpaRepository<ChatParticipant, Long> {
    
    Optional<ChatParticipant> findByChatAndOwner(Chat chat, Users owner);
}
