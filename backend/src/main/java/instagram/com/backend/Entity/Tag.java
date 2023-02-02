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
@Table(name = "tag")
@Entity(name = "Tag")
public class Tag {
    @Id
    @SequenceGenerator(
        name = "tag_sequence",
        sequenceName = "tag_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "tag_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @NotBlank(message = "content cannot be blank")
    @Column(name = "content", nullable = false, unique = true)
    private String content;


    @Column(name = "tag_quantity")
    private Long tagQuantity = 0L;


    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "tag_post",
        joinColumns = @JoinColumn(name = "tag_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "post_Id", referencedColumnName = "id")
    )
    private List<Post> posts = new ArrayList<>();


    public Tag( String content) {
        this.content = content;
    }

    public void addTagToPost(Post post) {
        this.getPosts().add(post);
        this.setTagQuantity(this.getTagQuantity() + 1);
        post.getTags().add(this);
    }

    public void removeTagFromPost(Post post) {
        this.getPosts().remove(post);
        this.setTagQuantity(this.getTagQuantity() - 1);
    }
    
    
}
