package com.kl.controller;

import com.kl.model.Result;
import com.kl.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
//@CrossOrigin(origins = "*") // hackathon test
public class RoomRestController {

    @Autowired
    private RoomService roomService; // the roomservice bean

    /**
     *  front end click the roombutton,we don;t have to received data
     * @return
     */
    @PostMapping
    public Result createRoom(@RequestBody Map<String, Object> body){
        String premise = body == null ? "" : (String) body.getOrDefault("premise", "");
        System.out.println(premise);
        Map<String, Object> roomData = roomService.createRoom(premise);
        return Result.success(roomData);
    }

    /**
     * Check if room exists and can be joined (safe operation, no state modification)
     * Used to validate room before establishing WebSocket connection
     */
    @GetMapping("/{roomCode}/check")
    public Result checkRoom(@PathVariable String roomCode) {
        Map<String, Object> checkResult = roomService.checkRoom(roomCode);

        if (checkResult.containsKey("error")) {
            return Result.error((String) checkResult.get("error"));
        }

        return Result.success(checkResult);
    }

    /**
     * join room
     * 接收前端从 CHECK 端点获得的 playerId
     */
    @PostMapping("/{roomCode}/{playerId}/join")
    public Result joinRoom(@PathVariable String roomCode, @PathVariable String playerId){


        if (playerId == null || playerId.isEmpty()) {
            return Result.error("MISSING_PLAYER_ID");
        }

        // try get the data from the room
        Map<String, Object> data = roomService.joinRoom(roomCode, playerId);
        // can't find the room
        if (data == null) {
            return Result.error("ROOM_NOT_FOUND");
        }
        //find the room but the room is full or the room is locked (the game already start)
        if (data.containsKey("error")) {
            return Result.error((String) data.get("error"));
        }

        return Result.success(data);
    }
}
