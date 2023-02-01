package instagram.com.backend.Entity;


import java.util.List;
import javax.persistence.*;

import instagram.com.backend.Validation.IsFollow;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IsFollow
@Table(name = "follow", uniqueConstraints = {@UniqueConstraint(columnNames = {"follower_id", "following_id"})})
@Entity(name = "Follow")
public class Follow {
    @Id
    @SequenceGenerator(
        name = "follow_sequence",
        sequenceName = "follow_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "follow_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "follower_id", referencedColumnName = "id")
    private Users follower;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(name = "following_id", referencedColumnName = "id")
    private Users following;

    public Follow(Users follower, Users following) {
        this.follower = follower;
        this.following = following;
    }

    
}
