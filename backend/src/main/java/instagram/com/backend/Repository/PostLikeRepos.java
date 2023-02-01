package instagram.com.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.PostLike;

@Repository
public interface PostLikeRepos extends JpaRepository<PostLike, Long> {
    
}
