package instagram.com.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Comment;
import instagram.com.backend.Entity.Post;

@Repository
public interface CommentRepos extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
    List<Comment> findByParentComment(Comment parentComment);
}
