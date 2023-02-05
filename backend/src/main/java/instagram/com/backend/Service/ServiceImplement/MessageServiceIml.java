package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.ChatParticipant;
import instagram.com.backend.Entity.Message;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Request.MessageRequest;
import instagram.com.backend.Entity.Response.ChatParticipantResponse;
import instagram.com.backend.Entity.Response.ChatResponse;
import instagram.com.backend.Entity.Response.MessageResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.ChatParticipantRepos;
import instagram.com.backend.Repository.ChatRepos;
import instagram.com.backend.Repository.MessageRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.MessageService;

@Service
public class MessageServiceIml implements MessageService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    ChatRepos chatRepos;
    @Autowired
    MessageRepos messageRepos;
    @Autowired
    ChatParticipantRepos chatParticipantRepos;


    @Override
    public MessageResponse addMessage(MessageRequest messageRequest) {
       Users authUser = getAuthUser();
       Chat chat = isCheckChat(messageRequest.getChatId());
       ChatParticipant participant = isCheckChatParticipant(chat, authUser);
       Message message = new Message(messageRequest.getText(), chat, participant);
        message.addMessageToChat(chat, participant);
        messageRepos.save(message);
        chatRepos.save(chat);

        MessageResponse response = mapMessageToResponse(message);
        return response;

    }
    @Override
    public void deleteMessage(Long messageId) {
        Users authUser = getAuthUser();
        Optional<Message> entity = messageRepos.findById(messageId);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the message not found");
        }
        Message message = entity.get();
        Chat chat = message.getChat();
        ChatParticipant participant = message.getChatParticipant();
        if(participant.getOwner().getId() == authUser.getId()) {
            message.removeMessageFromChat(chat, participant);
             chatRepos.save(chat);
             messageRepos.delete(message);
        } else {
            throw new BadResultException("are not authorized to delete the message");
        }
        
        
    }
    @Override
    public List<MessageResponse> getMessagesByChat(Long chatId) {
        Chat chat = isCheckChat(chatId);
        List<Message> messages = messageRepos.findByChat(chat);
        List<MessageResponse> responses = messages.stream().map(message -> mapMessageToResponse(message)).collect(Collectors.toList());

        return responses;
    }


    private Users isCheck(Optional<Users> entity) {
        if(entity.isPresent()) {
            return entity.get();
        }
        throw new EntityNotFountException("the user not found");
    }
    private UserResponse mapUserToUserResponse(Users user) {
        UserResponse userresResponse = new UserResponse(user.getId(), user.getUsername(), user.getUsername(), user.getRole(), user.getActive(), user.getIntroduction(), user.getFollowersCount(), user.getFollowingsCount(), user.getAvatarUrl(), user.getPostCounts());

        return userresResponse;

    }

    private Users getAuthUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Users> entity = usersRepos.findByUsername(username);
        Users user = isCheck(entity);
        return user;
    }

    private ChatParticipantResponse mapChatParticipantToResponse(ChatParticipant participant) {
        ChatParticipantResponse response = new ChatParticipantResponse(participant.getId(), mapUserToUserResponse(participant.getOwner()), participant.getChat().getId());
        return response;
    }

    private ChatResponse mapChatToResponse(Chat chat) {
        List<ChatParticipantResponse> participantResponse = chat.getParticipants().stream().map(participant -> mapChatParticipantToResponse(participant)).collect(Collectors.toList());
        ChatResponse response = new ChatResponse(chat.getId(), chat.getActive(), chat.getDateCreated(), chat.getDateUpdated(), participantResponse);

        return response;
    }

    private MessageResponse mapMessageToResponse(Message message) {
        MessageResponse response = new MessageResponse(message.getId(), message.getText(), message.getChat().getId(), mapChatParticipantToResponse(message.getChatParticipant()));
        return response;
    }

    private Chat isCheckChat(Long chatId) {
        Optional<Chat> entity = chatRepos.findById(chatId);
       if(entity.isPresent()) {
        return entity.get();
       }
       throw new EntityNotFountException("the chat not found");
    }   

    private ChatParticipant isCheckChatParticipant(Chat chat, Users user) {
        Optional<ChatParticipant> entity = chatParticipantRepos.findByChatAndOwner(chat, user);
        if(entity.isPresent()) {
            return entity.get();
           }
           throw new EntityNotFountException("the chat participant not found");
    }

    
}
