package instagram.com.backend.Entity;

import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import instagram.com.backend.Validation.IsFollow;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "post_like", uniqueConstraints = {@UniqueConstraint(columnNames = {"owner_id", "post_id"})})
@Entity(name = "Post_like")
public class PostLike {
    @Id
    @SequenceGenerator(
        name = "post_like_sequence",
        sequenceName = "post_like_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "post_like_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

  
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "owner_id",
        referencedColumnName = "id"       
    )
    private Users owner;

   
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "post_id",
        referencedColumnName = "id"
    )
    private Post post;

    public PostLike( Users owner, Post post) {
        this.owner = owner;
        this.post = post;
    }
    
}
