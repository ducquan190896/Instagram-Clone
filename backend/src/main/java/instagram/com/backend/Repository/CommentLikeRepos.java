package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Comment;
import instagram.com.backend.Entity.CommentLike;
import instagram.com.backend.Entity.Users;

@Repository
public interface CommentLikeRepos extends JpaRepository<CommentLike, Long> {
    Optional<CommentLike> findByOwnerAndComment(Users owner, Comment comment);
    List<CommentLike> findByComment(Comment comment);
}
