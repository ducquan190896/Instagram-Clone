package instagram.com.backend.Entity;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;

import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Validation.IsFollowers;
import instagram.com.backend.Validation.IsFollowings;
import lombok.*;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vote", uniqueConstraints = {@UniqueConstraint(columnNames = {"owner_id", "poll_id"})})
@Entity(name = "Vote")
public class Vote {
    @Id
    @SequenceGenerator(
        name = "vote_sequence",
        sequenceName = "vote_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "vote_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "owner_id",
        referencedColumnName = "id"
    )
    private Users owner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "poll_id",
        referencedColumnName = "id"
    )
    private Poll poll;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "choice_id",
        referencedColumnName = "id"
    )   
    private Choice choice;

    public Vote(Users owner, Poll poll, Choice choice) {
        this.owner = owner;
        this.poll = poll;
        this.choice = choice;
    }

    public void addYourVote(Users owner, Poll poll, Choice choice) {
        owner.getVotes().add(this);
        poll.getVotes().add(this);
        choice.getVotes().add(this);
        choice.setVoteCount(choice.getVoteCount() + 1);
    }

    public void removeYourVote(Users owner, Poll poll, Choice choice) {
        owner.getVotes().remove(this);
        poll.getVotes().remove(this);
        choice.getVotes().remove(this);
        choice.setVoteCount(choice.getVoteCount() - 1);
    }

    
}
