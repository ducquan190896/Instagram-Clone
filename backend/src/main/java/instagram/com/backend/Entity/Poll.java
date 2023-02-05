package instagram.com.backend.Entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import instagram.com.backend.Entity.Enum.Role;
import lombok.*;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "poll")
@Entity(name = "Poll")
public class Poll {
    @Id
    @SequenceGenerator(
        name = "poll_sequence",
        sequenceName = "poll_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "poll_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @NotBlank(message = "question cannot be null")
    @Column(name = "question", nullable = false)
    private String question;

    @OneToOne(fetch = FetchType.EAGER, cascade =  CascadeType.ALL)
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private Post post;

    @Min(value = 1 ,message = "expire time must be at least one day")
    @Column(name = "expire_days")
    private int expireDays;

    @Size(max = 5, min = 2, message = "choice number must be between 2 and 5")
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Choice> choices = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vote> votes = new ArrayList<>();

    public Poll(String question, int expireDays) {
        this.question = question;
        this.expireDays = expireDays;
    }

    public Poll(String question, Post post) {
        this.question = question;
        this.post = post;
    }

    public void addChoiceToPost(Choice choice) {
        this.getChoices().add(choice);
        choice.setPoll(this);
    }

    
    public void removeChoiceFromPost(Choice choice) {
        this.getChoices().remove(choice);
        choice.setPoll(null);
    }

    @Override
    public String toString() {
        return "Poll [id=" + id + ", question=" + question + ", post=" + post + ", choices=" + choices + "]";
    }
    
    
    
    
}
