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
@Table(name = "story")
@Entity(name = "Story")
public class Story {
    @Id
    @SequenceGenerator(
        name = "story_sequence",
        sequenceName = "story_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "story_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM--dd HH:mm")
    @CreationTimestamp
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @UpdateTimestamp
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;


    @ElementCollection(targetClass = String.class)
    @CollectionTable(
        name = "story_images",
        joinColumns = @JoinColumn(name = "story_id")

    )
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private Users owner;

    @JsonIgnore
    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StoryLike> storyLikes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StoryNotification> storyNotifications = new ArrayList<>();


    public Story(List<String> imageUrls, Users owner) {
        this.imageUrls = imageUrls;
        this.owner = owner;
    }


    

}
