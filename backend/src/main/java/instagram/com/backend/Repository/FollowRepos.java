package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Follow;
import instagram.com.backend.Entity.Users;

@Repository
public interface FollowRepos extends JpaRepository<Follow, Long> {
    List<Follow> findByFollowing(Users following);
    List<Follow> findByFollower(Users follower);
    Optional<Follow> findByFollowerAndFollowing(Users follower, Users following);
}
