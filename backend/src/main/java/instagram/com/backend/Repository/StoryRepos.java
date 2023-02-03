package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Story;

@Repository
public interface StoryRepos extends JpaRepository<Story, Long> {

    @Query(value = "select story from Story story LEFT JOIN story.owner owner WHERE owner.id = :ownerId AND owner.active = :active ORDER BY story.dateCreated DESC")
    List<Story> findByActiveOwner(Long ownerId, boolean active);

  

    @Query(value = "select story from Story story LEFT JOIN story.owner owner where owner.active = :active AND owner.id in :ids ORDER BY story.dateCreated DESC")
    List<Story> findByActiveFollowings(List<Long> ids, boolean active);
}
