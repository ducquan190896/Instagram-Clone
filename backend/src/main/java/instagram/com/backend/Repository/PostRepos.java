package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Users;

@Repository
public interface PostRepos extends JpaRepository<Post, Long> {
    List<Post> findByOwner(Users Owner);
}
