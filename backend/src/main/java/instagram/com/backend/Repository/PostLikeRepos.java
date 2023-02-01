package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.PostLike;
import instagram.com.backend.Entity.Users;

@Repository
public interface PostLikeRepos extends JpaRepository<PostLike, Long> {
    List<PostLike> findByPost(Post post);
    Optional<PostLike> findByPostAndOwner(Post post, Users user);
}
