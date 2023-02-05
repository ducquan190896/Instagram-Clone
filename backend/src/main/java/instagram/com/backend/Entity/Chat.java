package instagram.com.backend.Entity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import instagram.com.backend.Entity.Enum.Role;
import lombok.*;


@Table(name = "chat")
@Entity(name = "Chat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    @Id
    @SequenceGenerator(
        name = "chat_sequence",
        sequenceName = "chat_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "chat_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "active")
    private boolean active = true;


    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @UpdateTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;

    @Size(min = 2)
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ChatParticipant> participants = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Message> messages = new ArrayList<>();

    public Chat(List<ChatParticipant> participants) {
        this.participants = participants;
    }

    @Override
    public String toString() {
        return "Chat [id=" + id + ", active=" + active + ", dateCreated=" + dateCreated + ", dateUpdated=" + dateUpdated
                + ", participants=" + participants + "]";
    }

    public boolean getActive() {
        return this.active;
    }

    public void setActive(boolean active) {
        this.setActive(active);
    }
    
}
