package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Users;

@Repository
public interface UsersRepos extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
    List<Users> findByActiveAndUsernameContaining(boolean active,String username);
    List<Users> findByUsernameContaining(String username);
}
