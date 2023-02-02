package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.Tag;
import instagram.com.backend.Entity.Users;

@Repository
public interface PostRepos extends JpaRepository<Post, Long> {
    List<Post> findByOwner(Users Owner);

    @Query( value = "select p from Post p LEFT JOIN p.owner owner WHERE p.content LIKE CONCAT('%', :content, '%') and owner.active = :active")
    List<Post> findByContentContainingAndActiveUser(String content, boolean active);

     @Query(value= "select p from Post p LEFT JOIN p.tags tag where tag.content = :tag AND p.owner.active = true ORDER By p.dateCreated DESC")
    List<Post> findByTags(String tag);
    
    List<Post> findByContentContaining(String content);
   
}
