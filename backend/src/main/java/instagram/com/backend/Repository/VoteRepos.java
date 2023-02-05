package instagram.com.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import instagram.com.backend.Entity.Vote;

@Repository
public interface VoteRepos extends JpaRepository<Vote, Long>{

    @Query("select vote from Vote vote where vote.owner.id = :ownerId AND vote.poll.id = :pollId")
    Optional<Vote> findByOwnerAndPoll(Long ownerId, Long pollId);

    @Query("select vote from Vote vote LEFT JOIN vote.poll poll where poll.id = :pollId")
    List<Vote> findByPoll(Long pollId);
}
