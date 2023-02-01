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
import com.fasterxml.jackson.databind.JsonMappingException.Reference;

import instagram.com.backend.Entity.Enum.CommentNotificationType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comment_notification")
@Entity(name = "Comment_notification")
public class CommentNotification {
    @Id
    @SequenceGenerator(
        name = "comment_notification_sequence",
        sequenceName = "comment_notification_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "comment_notification_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private CommentNotificationType type;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "parent_comment_id",
        referencedColumnName = "id"
    )
    private Comment parentComment;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @CreationTimestamp
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    public CommentNotification(CommentNotificationType type, Users creator, Users receiver, Post post,
            Comment parentComment) {
        this.type = type;
        this.creator = creator;
        this.receiver = receiver;
        this.post = post;
        this.parentComment = parentComment;
    }

    
}
