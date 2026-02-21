package com.kl.interceptor;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.WebSocketHandler;

import java.util.Map;

/**
 * INTERCEPTOR FOE CHOTROLLER WEBSOCKET
 */
@Component
public class WsHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   org.springframework.http.server.ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletReq) {
            var http = servletReq.getServletRequest();
            String roomCode = http.getParameter("roomCode");
            String playerId = http.getParameter("playerId");

            if (roomCode != null) attributes.put("roomCode", roomCode);
            if (playerId != null) attributes.put("playerId", playerId);
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               org.springframework.http.server.ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
    }
}