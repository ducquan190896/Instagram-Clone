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
@Table(name = "post")
@Entity(name = "Post")
public class Post {
    @Id
    @SequenceGenerator(
        name = "post_sequence",
        sequenceName = "post_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "post_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @NotBlank(message = "content cannot be blank")
    @Column(name = "content", nullable = false)
    private String content;

    
    @ElementCollection(targetClass = String.class)
    @CollectionTable(
        name = "post_images",
        joinColumns = @JoinColumn(name = "post_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>(); 

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    @CreationTimestamp
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @UpdateTimestamp
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;

    @Column(name = "post_comment_count")
    private Long commentCount = 0L;

    @Column(name = "post_like_count")
    private Long likeCount = 0L;

    

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private Users owner;

    @JsonIgnore
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PostLike> postLikes = new ArrayList<>();

    public Post( String content, List<String> imageUrls, Users owner) {
        this.content = content;
        this.imageUrls = imageUrls;
        this.owner = owner;
    }
    public Post( String content,  Users owner) {
        this.content = content;
        this.owner = owner;
    }

    

}
