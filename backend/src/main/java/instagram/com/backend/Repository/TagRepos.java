package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Tag;

@Repository
public interface TagRepos extends JpaRepository<Tag, Long> {
     @Query("select tag from Tag tag where tag.content like CONCAT('%', :content, '%') ORDER BY tag.content ASC ")
    List<Tag> findByContentContaining(String content);
    Optional<Tag> findByContent(String content);
}
