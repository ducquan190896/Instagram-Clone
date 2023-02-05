package instagram.com.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Poll;

@Repository
public interface PollRepos extends JpaRepository<Poll, Long> {
    
}
