package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.ChatParticipant;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Response.ChatResponse;
import instagram.com.backend.Mapper.ChatMapper;
import instagram.com.backend.Repository.ChatParticipantRepos;
import instagram.com.backend.Repository.ChatRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.ChatService;
import instagram.com.backend.Service.UserService;

@Service
public class ChatServiceIml implements ChatService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    ChatRepos chatRepos;
    @Autowired
    ChatParticipantRepos chatParticipantRepos;
    @Autowired
    UserService userService;
    @Autowired
    ChatMapper chatMapper;


    @Override
    public List<ChatResponse> getAllChats() {
        List<Chat> chats = chatRepos.findAll();

        List<ChatResponse> responses = chats.stream().map(chat -> chatMapper.mapChatToResponse(chat)).collect(Collectors.toList());

        return responses;
    }

    @Override
    public ChatResponse getChatByAuthUserAndReceiver(Long receiverId) {
        Users authUser = userService.getAuthUser();
        Users receiver = userService.isCheckUser(receiverId);
        
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
            ChatResponse response = chatMapper.mapChatToResponse(chat);
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

            ChatResponse response = chatMapper.mapChatToResponse(chat);
            return response;
        }
       
    } 

    @Override
    public ChatResponse getChatById(Long chatId) {
        Optional<Chat> chatEntity = chatRepos.findById(chatId);
        if(!chatEntity.isPresent()) {
            throw new EntityNotFoundException("the chat not found");
        }
        return chatMapper.mapChatToResponse(chatEntity.get());
    }

    @Override
    public Chat isCheckChat(Long chatId) {
        Optional<Chat> chatEntity = chatRepos.findById(chatId);
        if(!chatEntity.isPresent()) {
            throw new EntityNotFoundException("the chat not found");
        }
        return chatEntity.get();
    }

    @Override
    public List<ChatResponse> getChatsByAuthUser() {
        Users authUser = userService.getAuthUser();
        List<Chat> chats = chatRepos.findByUserId(authUser.getId());

        List<ChatResponse> responses = chats.stream().map(chat -> chatMapper.mapChatToResponse(chat)).collect(Collectors.toList());

        return responses;
    }

}
