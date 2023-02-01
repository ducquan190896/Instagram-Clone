package instagram.com.backend.Entity;
import java.util.List;
import javax.persistence.*;

import instagram.com.backend.Entity.Enum.PostNotificationType;
import instagram.com.backend.Validation.IsFollow;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "post_notification")
@Entity(name = "Post_notification")
public class PostNotification {
    @Id
    @SequenceGenerator(
        name = "post_notification_sequence",
        sequenceName = "post_notification_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "post_notification_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private PostNotificationType type;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "creator_id",
        referencedColumnName = "id"
    )
    private Users creator;  

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "receiver",
        referencedColumnName = "id"
    )
    private Users receiver;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "post_id",
        referencedColumnName = "id"
    )
    private Post post;

    public PostNotification(PostNotificationType type, Users creator, Users receiver, Post post) {
        this.type = type;
        this.creator = creator;
        this.receiver = receiver;
        this.post = post;
    }

    
    
}
