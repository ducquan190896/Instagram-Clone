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


@Table(name = "message")
@Entity(name = "Message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @SequenceGenerator(
        name = "message_sequence",
        sequenceName = "message_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "message_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @NotBlank(message = "text of message cannot be blank")
    @Column(name = "text", nullable = false)
    private String text;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "chat_id",
        referencedColumnName = "id"
    )
    private Chat chat;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "chat_participant_id",
        referencedColumnName = "id"
    )
    private ChatParticipant chatParticipant;


    public Message( String text, Chat chat,
            ChatParticipant chatParticipant) {
        this.text = text;
        this.chat = chat;
        this.chatParticipant = chatParticipant;
    }
    

    public Message( String text) {
        this.text = text;
    }


    

    public void addMessageToChat(Chat chat, ChatParticipant chatParticipant) {
        this.setChat(chat);
        this.setChatParticipant(chatParticipant);
        chat.getMessages().add(this);
        chatParticipant.getMessages().add(this);
    }

    public void removeMessageFromChat(Chat chat, ChatParticipant chatParticipant) {
       
        chat.getMessages().remove(this);
        chatParticipant.getMessages().remove(this);
    }


    @Override
    public String toString() {
        return "Message [id=" + id + ", text=" + text + ", chat=" + chat + ", chatParticipant=" + chatParticipant + "]";
    }



    
}
