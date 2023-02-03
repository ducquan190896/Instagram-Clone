package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Story;
import instagram.com.backend.Entity.StoryLike;
import instagram.com.backend.Entity.Users;

@Repository
public interface StoryLikeRepos extends JpaRepository<StoryLike, Long> {
    // @Query("select l from storyLike l LEFT JOIN l.story story where story.id = :storyId ORDER BY l.dateCreated DESC")
    // List<StoryLike> findByStoryID(Long storyId);
    List<StoryLike> findByStory(Story story);
    Optional<StoryLike> findByOwnerAndStory(Users owner, Story story);
}
