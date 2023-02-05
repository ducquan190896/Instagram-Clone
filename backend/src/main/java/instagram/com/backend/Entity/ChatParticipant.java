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

import instagram.com.backend.Entity.Enum.Role;
import lombok.*;


@Table(name = "chat_participant")
@Entity(name = "Chat_participant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipant {
    @Id
    @SequenceGenerator(
        name = "chat_participant_sequence",
        sequenceName = "chat_participant_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "chat_participant_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(
        name = "owner_id",
        referencedColumnName = "id"
    )
    private Users owner;

    @JsonIgnore
    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(
        name = "chat_id",
        referencedColumnName = "id"
    )
    private Chat chat;


    @OneToMany(mappedBy = "chatParticipant", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();

    @Override
    public String toString() {
        return "ChatParticipant [id=" + id + ", owner=" + owner;
    }

    public ChatParticipant(Users owner, Chat chat) {
        this.owner = owner;
        this.chat = chat;
    }
    public ChatParticipant(Users owner) {
        this.owner = owner;
    }

    public void addParticipantToChat(Chat chat) {
        chat.getParticipants().add(this);
        this.setChat(chat);
    }

    
    

}
