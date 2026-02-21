package com.kl.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Data
@NoArgsConstructor
public class Room {
    public String code;
    public int maxPlayers;
    public boolean locked;
    public RoomStatus status;
    private int round;
    private String premise;
    public List<Player> players = new ArrayList<>();

    // 当前轮所有发言（playerId -> message）
    private Map<String, String> roundMessages = new ConcurrentHashMap<>();

    // 记录谁在这一轮已经发过言（avoid repeat）
    private Set<String> spokeThisRound = ConcurrentHashMap.newKeySet();

    private String aiId;          // AI playerId

    // voting
    private final Map<String, Integer> voteCount = new ConcurrentHashMap<>();
    private final java.util.Set<String> votedThisRound = java.util.concurrent.ConcurrentHashMap.newKeySet();


    public Room(String code,String premise) {
        this.code = code;
        this.maxPlayers = 4; //maxnumber of THE PLAYER
        this.premise = premise;
        this.round = 0;
        this.locked = false;
        this.status = RoomStatus.LOBBY;
    }
}
