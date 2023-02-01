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
@Table(name = "comment")
@Entity(name = "Comment")
public class Comment {
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

    @NotBlank(message = "content cannot be blank")
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "nested_comment_count")
    private Long nestedCommentCount = 0L;

    @Column(name = "comment_like_count")
    private Long commentLikeCount = 0L;

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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    @CreationTimestamp
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @UpdateTimestamp
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;

    @JsonIgnore
    @OneToMany(mappedBy = "comment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CommentLike> commentLikes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "parentComment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CommentNotification> commentNotifications = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "parent_comment_id",
        referencedColumnName = "id"
    )
    private Comment parentComment;

    @JsonIgnore
    @OneToMany(mappedBy = "parentComment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Comment> nestedComments = new ArrayList<>();


    

    public Comment(String content, Users owner, Post post) {
        this.content = content;
        this.owner = owner;
        this.post = post;
    }




    //the comment params is the parent comment, this.... is the child comment
    public void addCommentToParentComment(Comment comment) {
        this.parentComment = comment;
        comment.getNestedComments().add(this);
        comment.setNestedCommentCount(comment.getNestedCommentCount() + 1);
    }
}
