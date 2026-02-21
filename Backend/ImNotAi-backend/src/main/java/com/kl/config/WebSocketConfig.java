package com.kl.config;


import com.kl.interceptor.WsHandshakeInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private  WsHandshakeInterceptor handshakeInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 后端广播给前端订阅的地址前缀：/topic/...
        registry.enableSimpleBroker("/topic");
        // 前端发给后端的地址前缀：/app/...
        registry.setApplicationDestinationPrefixes("/app");
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .addInterceptors(handshakeInterceptor)
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
