package instagram.com.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Image;

@Repository
public interface ImageRepos extends JpaRepository<Image, Long> {
    Optional<Image> findByFileName(String fileName);
}
