package instagram.com.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Choice;

@Repository
public interface ChoiceRepos extends JpaRepository<Choice, Long> {
    
}
