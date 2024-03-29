package instagram.com.backend.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;



@Configuration
@EnableWebSocketMessageBroker
public class SocketIOConfig implements WebSocketMessageBrokerConfigurer {
  @Autowired
  SocketChannelInterceptor socketChannelInterceptor;
 
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
     registry.addEndpoint("/socket").setAllowedOriginPatterns("*").withSockJS();
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
     registry.setApplicationDestinationPrefixes("/app");
     registry.enableSimpleBroker("/chatroom", "/post");
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
      registration.interceptors(socketChannelInterceptor);
  }
}