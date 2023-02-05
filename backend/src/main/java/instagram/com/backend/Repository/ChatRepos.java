package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Chat;

@Repository
public interface ChatRepos extends JpaRepository<Chat, Long> {

    @Query("select chat from Chat chat LEFT JOIN chat.participants participant where participant.owner.id = :userId ORDER BY chat.dateUpdated DESC")
    List<Chat> findByUserId(Long userId);


    @Query("select DISTINCT chat from Chat chat LEFT JOIN chat.participants participant where participant.owner.id = :userId1 OR participant.owner.id = :userId2")
    List<Chat> findByUsers(Long userId1, Long userId2);
}
