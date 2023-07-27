package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.ChatParticipant;
import instagram.com.backend.Entity.Message;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Request.MessageRequest;
import instagram.com.backend.Entity.Response.MessageResponse;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Exception.EntityNotFountException;
import instagram.com.backend.Mapper.MessageMapper;
import instagram.com.backend.Repository.ChatParticipantRepos;
import instagram.com.backend.Repository.ChatRepos;
import instagram.com.backend.Repository.MessageRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Security.SecurityConstant;
import instagram.com.backend.Service.ChatService;
import instagram.com.backend.Service.MessageService;
import instagram.com.backend.Service.UserService;


@Service
@Transactional
public class MessageServiceIml implements MessageService {
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    ChatRepos chatRepos;
    @Autowired
    MessageRepos messageRepos;
    @Autowired
    ChatParticipantRepos chatParticipantRepos;
    @Autowired
    UserService userService;
    @Autowired
    MessageMapper messageMapper;
    @Autowired
    ChatService chatService;


    @Override
    public MessageResponse addMessage(MessageRequest messageRequest) {
        Users authUser = userService.getAuthUser();
        Chat chat = chatService.isCheckChat(messageRequest.getChatId());
        ChatParticipant participant = isCheckChatParticipant(chat, authUser);
        Message message = new Message(messageRequest.getText(), chat, participant);
        message.addMessageToChat(chat, participant);
        messageRepos.save(message);
        chatRepos.save(chat);

        MessageResponse response = messageMapper.mapMessageToResponse(message);
        return response;

    }

    
    @Override
    public MessageResponse addMessageFromSocket(MessageRequest messageRequest) {
        String tokenBearer = messageRequest.getToken();
        String token = tokenBearer.replace(SecurityConstant.authorization, "");
        System.out.println(token);
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(SecurityConstant.private_key)).build().verify(token);
        String username = decodedJWT.getSubject();
        List<String> claims = decodedJWT.getClaim("claims").asList(String.class);
        List<SimpleGrantedAuthority> authorities = claims.stream().map(clai -> new SimpleGrantedAuthority(clai)).collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Users authUser = userService.getAuthUser();
        // Optional<Users> entity = usersRepos.findByUsername(messageRequest.getUsername());
        // if(!entity.isPresent()) {
        //     throw new EntityNotFoundException("the username not found");
        // }
        // Users authUser = entity.get();
        System.out.println(authUser);
        Chat chat = chatService.isCheckChat(messageRequest.getChatId());
        ChatParticipant participant = isCheckChatParticipant(chat, authUser);
        Message message = new Message(messageRequest.getText(), chat, participant);
        message.addMessageToChat(chat, participant);
        messageRepos.save(message);
        System.out.println(message);
        chatRepos.save(chat);

        MessageResponse response = messageMapper.mapMessageToResponse(message);
        System.out.println("response: ...");
        System.out.println(response);
        return response;
    }

    @Override
    public UsernamePasswordAuthenticationToken authenticateMessageFromSocket(String username1, String token1) {
        
        String token = token1.replace(SecurityConstant.authorization, "");
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(SecurityConstant.private_key)).build().verify(token);
        String username = decodedJWT.getSubject();
        List<String> claims = decodedJWT.getClaim("claims").asList(String.class);
        List<SimpleGrantedAuthority> authorities = claims.stream().map(clai -> new SimpleGrantedAuthority(clai)).collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UsernamePasswordAuthenticationToken authenticationToken =  new UsernamePasswordAuthenticationToken(username, null, authorities);
        return authenticationToken;
    }

    @Override
    public void deleteMessage(Long messageId) {
        Users authUser = userService.getAuthUser();
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
        Chat chat = chatService.isCheckChat(chatId);
        List<Message> messages = messageRepos.findByChat(chat);
        List<MessageResponse> responses = messages.stream().map(message -> messageMapper.mapMessageToResponse(message)).collect(Collectors.toList());

        return responses;
    }
   

    private ChatParticipant isCheckChatParticipant(Chat chat, Users user) {
        Optional<ChatParticipant> entity = chatParticipantRepos.findByChatAndOwner(chat, user);
        if(entity.isPresent()) {
            return entity.get();
           }
           throw new EntityNotFountException("the chat participant not found");
    }

    
}
