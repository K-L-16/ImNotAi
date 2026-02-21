package com.kl.controller;

import com.kl.dto.WsAction;
import com.kl.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class RoomWsController {

    @Autowired
    private  RoomService roomService;

    // 前端publish 到：/app/room/{roomCode}/action
    @MessageMapping("/room/{roomCode}/action")
    public void onAction(@DestinationVariable String roomCode, WsAction action) {
        if (action == null || action.getType() == null) return; // nothing received

        System.out.println("收到了action");
        System.out.println(action.getType()+" "+ action.getPlayerId());

        //if the action is the start
        if ("START".equals(action.getType())) {
            roomService.startGame(roomCode, action.getPlayerId());
        }
        //if the action is submit message
        else if ("SUBMIT_MESSAGE".equals(action.getType())) {
            Object msgObj = action.getPayload() == null ? null : action.getPayload().get("message");
            String message = msgObj == null ? "" : msgObj.toString();
            roomService.submitMessage(roomCode, action.getPlayerId(), message);
        }
        //if the action is submit vote
        else if ("SUBMIT_VOTE".equals(action.getType())) {
            Object targetObj = action.getPayload() == null ? null : action.getPayload().get("targetId");
            String targetId = targetObj == null ? "" : targetObj.toString();
            roomService.submitVote(roomCode, action.getPlayerId(), targetId);
        }
    }
}
