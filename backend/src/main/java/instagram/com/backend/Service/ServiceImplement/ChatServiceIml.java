package instagram.com.backend.Service.ServiceImplement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.ChatParticipant;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.ChatParticipantResponse;
import instagram.com.backend.Entity.Response.ChatResponse;
import instagram.com.backend.Entity.Response.UserResponse;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Repository.ChatParticipantRepos;
import instagram.com.backend.Repository.ChatRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.ChatService;

@Service
public class ChatServiceIml implements ChatService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    ChatRepos chatRepos;
    @Autowired
    ChatParticipantRepos chatParticipantRepos;
   

    



    @Override
    public List<ChatResponse> getAllChats() {
        List<Chat> chats = chatRepos.findAll();

        List<ChatResponse> responses = chats.stream().map(chat -> mapChatToResponse(chat)).collect(Collectors.toList());

        return responses;
    }

    @Override
    public ChatResponse getChatByAuthUserAndReceiver(Long receiverId) {
        Users authUser = getAuthUser();
        Optional<Users> receiverEntity = usersRepos.findById(receiverId);
        Users receiver = isCheck(receiverEntity);
        
        List<Chat> chatList = chatRepos.findByUsers(authUser.getId(), receiverId);
        List<Chat> chatList2 = chatList.stream().filter(chat -> {

            // ArrayList<ChatParticipant> arrayList = new ArrayList<>();
            // arrayList.addAll(chat.getParticipants());

            List<ChatParticipant> arrayList = chat.getParticipants();
            ChatParticipant participant1 = arrayList.get(0);
            ChatParticipant participant2 = arrayList.get(1);
            if(participant1.getOwner().getId() == authUser.getId() && participant2.getOwner().getId() == receiverId) {
                return true;
            } else if(participant2.getOwner().getId() == authUser.getId() && participant1.getOwner().getId() == receiverId) {
                return true;
            } 
            return false;

        }).collect(Collectors.toList());

        if(chatList2 != null && chatList2.size() > 0) {
            //if chat of the authUser and the receiver exist
            Chat chat = chatList2.get(0);
            ChatResponse response = mapChatToResponse(chat);
            return response;
        } else {
            // if the chat of the authUser and the receiver do not exist
            Chat chat = new Chat();
            ChatParticipant newParticipant1 = new ChatParticipant(authUser);
            ChatParticipant newParticipant2 = new ChatParticipant(receiver);
            newParticipant1.addParticipantToChat(chat);
            newParticipant2.addParticipantToChat(chat);

            chatRepos.save(chat);
            usersRepos.save(authUser);
            usersRepos.save(receiver);

            ChatResponse response = mapChatToResponse(chat);
            return response;
        }
       
    }


    @Override
    public List<ChatResponse> getChatsByAuthUser() {
        Users authUser = getAuthUser();
        List<Chat> chats = chatRepos.findByUserId(authUser.getId());

        List<ChatResponse> responses = chats.stream().map(chat -> mapChatToResponse(chat)).collect(Collectors.toList());

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
}
