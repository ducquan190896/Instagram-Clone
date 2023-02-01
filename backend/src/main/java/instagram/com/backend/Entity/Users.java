package instagram.com.backend.Entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;

import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Validation.IsFollowers;
import instagram.com.backend.Validation.IsFollowings;
import lombok.*;


@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = {"username", "email"})})
@Entity(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IsFollowers
@IsFollowings
public class Users {
    @Id
    @SequenceGenerator(
        name = "users_sequence",
        sequenceName = "users_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "users_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @NotBlank(message = "username cannot be blank")
    @Column(name = "username", nullable = false)
    private String username;

    @NotBlank(message = "email cannot be blank")
    @Column(name = "email", nullable = false)
    private String email;

    @NotBlank(message = "password cannot be blank")
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @NotBlank(message = "introduction cannot be blank")
    @Column(name = "introduction")
    private String introduction;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;
    
    @Column(name = "active")
    private boolean active = true;

    @Column(name = "followers_count")
    private Long followersCount = 0L;

    @Column(name = "followings_count")
    private long followingsCount = 0L;

    @Column(name = "post_count")
    private long postCounts = 0L;

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Follow> followers = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "following", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Follow> followings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PostLike> postLikes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PostNotification> postNotificationsCreator = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PostNotification> postNotificationsReceiver = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentNotification> commentNotificationsCreator = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentNotification> commentNotificationsReceiver = new ArrayList<>();

    

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();


    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentLike> commentLikes = new ArrayList<>();

    public Users(String username, String email, String password, String avatarUrl, String introduction) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatarUrl = avatarUrl;
        this.introduction = introduction;
      
    }

    public Users(String username, String email, String password,  String introduction) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.introduction = introduction;
      
    }
    public Users(String username, String email, String password,  String introduction, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.introduction = introduction;
        this.role = role;
      
    }
   
    public boolean getActive() {
        return this.active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
    
}
