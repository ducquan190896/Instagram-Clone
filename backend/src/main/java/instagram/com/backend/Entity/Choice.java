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
@Table(name = "choice")
@Entity(name = "Choice")
public class Choice {
    @Id
    @SequenceGenerator(
        name = "choice_sequence",
        sequenceName = "choice_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "choice_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @NotBlank(message = "answer cannot be blank")
    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "choice_count")
    private Long voteCount = 0L;
    

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "poll_id",
        referencedColumnName = "id"
    )
    private Poll poll;

    @JsonIgnore
    @OneToMany(mappedBy = "choice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vote> votes = new ArrayList<>();

    // public Choice( String answer, Poll poll) {
    //     this.answer = answer;
    //     this.poll = poll;
    // }

    public Choice( String answer) {
        this.answer = answer;
    }

    @Override
    public String toString() {
        return "Choice [id=" + id + ", answer=" + answer + ", voteCount=" + voteCount + "]";
    }

    
    
}
