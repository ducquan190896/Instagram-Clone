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
@Table(name = "comment_like", uniqueConstraints = {@UniqueConstraint(columnNames = {"owner_id", "comment_id"})})
@Entity(name = "Comment_like")
public class CommentLike {
    @Id
    @SequenceGenerator(
        name = "comment_sequence",
        sequenceName = "comment_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "comment_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(
        name = "owner_id",
        referencedColumnName = "id"
    )
    private Users owner;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(
        name = "post_id",
        referencedColumnName = "id"
    )
    private Post post; 

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(
        name = "comment_id",
        referencedColumnName = "id"
    )
    private Comment comment;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    @CreationTimestamp
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    public CommentLike(Users owner, Post post, Comment comment) {
        this.owner = owner;
        this.post = post;
        this.comment = comment;
    }

    
}
