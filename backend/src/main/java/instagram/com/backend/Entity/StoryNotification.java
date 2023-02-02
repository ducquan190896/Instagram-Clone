package instagram.com.backend.Entity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "story_notification")
@Entity(name = "Story_notification")
public class StoryNotification {
    @Id
    @SequenceGenerator(
        name = "story_notification_sequence",
        sequenceName = "story_notification_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "story_notification_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "type")
    private String type = "story_like";

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    @CreationTimestamp
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @UpdateTimestamp
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(
        name = "creator_id",
        referencedColumnName = "id"
    )
    private Users creator;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(
        name = "receiver_id",
        referencedColumnName = "id"
    )
    private Users receiver;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(
        name = "story_id",
        referencedColumnName = "id"
    )
    private Story story;

    public StoryNotification(Users creator, Users receiver, Story story) {
        this.creator = creator;
        this.receiver = receiver;
        this.story = story;
    }

    
}
