package com.kl.config;

import com.kl.service.RoomService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * LISTENER ==> LISTEN FROM CLIENT
 * !!!GET THE roomCode & playerId for catching any break
 */
@Component
public class WsDisconnectListener {

    private final RoomService roomService;

    public WsDisconnectListener(RoomService roomService) {
        this.roomService = roomService;
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());

        Object roomCodeObj = sha.getSessionAttributes() == null ? null : sha.getSessionAttributes().get("roomCode");
        Object playerIdObj = sha.getSessionAttributes() == null ? null : sha.getSessionAttributes().get("playerId");

        String roomCode = roomCodeObj == null ? null : roomCodeObj.toString();
        String playerId = playerIdObj == null ? null : playerIdObj.toString();

        if (roomCode == null || playerId == null) return;

        roomService.terminateRoomDueToDisconnect(roomCode, playerId);
    }
}