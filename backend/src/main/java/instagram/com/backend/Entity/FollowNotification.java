package instagram.com.backend.Entity;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import instagram.com.backend.Entity.Enum.PostNotificationType;
import instagram.com.backend.Validation.IsFollow;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "follow_notification")
@Entity(name = "Follow_notification")
public class FollowNotification {
    @Id
    @SequenceGenerator(
        name = "follow_notification_sequence",
        sequenceName = "follow_notification_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "follow_notification_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;


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
    

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @CreationTimestamp
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    public FollowNotification( Users creator, Users receiver) {
        
        this.creator = creator;
        this.receiver = receiver;
      
    }
}
