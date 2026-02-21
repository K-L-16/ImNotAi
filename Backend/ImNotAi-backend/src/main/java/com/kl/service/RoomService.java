package com.kl.service;

import com.kl.model.Player;
import com.kl.model.Room;
import com.kl.model.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ROOM SERVICE
 */
@Service
public class RoomService {

    private final Map<String, Room> rooms = new ConcurrentHashMap<>(); //这个rooms的map
    private final SecureRandom random = new SecureRandom(); //secure random number for the code
    private static final String ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    @Autowired
    private  SimpMessagingTemplate messagingTemplate; // send message to all front end

    @Autowired
    private AiService aiService; // ai service



    /**
     * generate the raondom number for the room code
     * @param len
     * @return
     */
    private String generateRoomCode(int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(ALPHANUM.charAt(random.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }


    /**
     * generate the room for the player and return the map obj
     * @return
     */
    public Map<String, Object> createRoom(String premise) {
        String roomCode;
        String hostId;

        // synchronized the generate room
        synchronized (rooms) {
            roomCode = generateRoomCode(6);
            while (rooms.containsKey(roomCode)) {
                roomCode = generateRoomCode(6);
            }

            Room room = new Room(roomCode, premise);
            hostId = "p_" + UUID.randomUUID().toString().substring(0, 8);
            Player host = new Player(hostId, true);
            room.getPlayers().add(host);
            rooms.put(roomCode, room);
        }

        return Map.of(
                "roomCode", roomCode,
                "playerId", hostId,
                "isHost", true
        );
    }
    // ------------------------------------------------------------------------the bulidLobbystatus-------------------------------------
    // THIS IS THE JSON STRUCTURE RETURN TO THE FRONT END FOR (WS /topic/...../state)
    private Map<String, Object> buildLobbyState(Room room) {
        return Map.of(
                "roomCode", room.getCode(),
                "status", room.getStatus().name(),
                "locked", room.isLocked(),
                "round", room.getRound(),
                "playerCount", room.getPlayers().size(),
                "maxPlayers", room.getMaxPlayers(),
                "premise", room.getPremise()
        );
    }
    // ------------------------------------------------------------------------the bulidLobbystatus-------------------------------------



    /**
     * join the room for the new player
     * @param roomCode
     * @return
     */
    public Map<String, Object> joinRoom(String roomCode) {
        //try to get the room first
        Room room = rooms.get(roomCode);
        //if the room does not exist
        if (room == null) {
            return null;
        }

        synchronized (room) {

            // the room is locked (game already start)
            if(room.isLocked()) {
                return Map.of("error", "ROOM_LOCKED");
            }

            // it's full
            if(room.getPlayers().size() >= room.getMaxPlayers()) {
                return Map.of("error", "ROOM_FULL");
            }

            //create the player
            String playerId = "p_" + UUID.randomUUID().toString().substring(0, 8);
            Player player = new Player(playerId, false);//false means this is not the host
            room.getPlayers().add(player); //add the palyer to the room

            //send all the message to all front end
            String dest = "/topic/room/" + roomCode + "/state";
            Object payload = buildLobbyState(room);
            messagingTemplate.convertAndSend(dest, payload);
            System.out.println("send the message to the all subscribe for room "+ roomCode);

            System.out.println("the num of player in " +roomCode +" " +room.getPlayers().size());//log out the number of the player

            return Map.of(
                    "roomCode", roomCode,
                    "playerId", playerId,
                    "isHost", false
            );
        }
    }

    /**
     * startgame
     * @param roomCode
     * @param playerId
     */
    public void startGame(String roomCode, String playerId) {
        Room room = rooms.get(roomCode);
        if (room == null) {
            // the room not exist return
            return;
        }

        synchronized (room) {

            // 1) it must be the host to start
            boolean isHost = room.getPlayers().stream()
                    .anyMatch(p -> p.isHost() && p.getId().equals(playerId));
            if (!isHost) {
                return;
            }

            // 2)if the game is already start return
            if (room.isLocked()) {
                return;
            }

            // 3) the min number of the player must be bigger than 2
            if (room.getPlayers().size() < 2) {
                return;
            }
            // insert AI player（只做一次）/////////////////////////////////////////////////////////
            if (room.getAiId() == null) {
                String aiId = "ai_" + UUID.randomUUID().toString().substring(0, 8);
                room.setAiId(aiId);
                room.getPlayers().add(new Player(aiId, false)); // 你 Player 现在没有 isAI 字段，先这样
            }

            // 4)update the room status
            room.setLocked(true);
            room.setStatus(RoomStatus.SPEAKING);
            room.setRound(1);

            // 5) announce to everyone
            String dest = "/topic/room/" + roomCode + "/state";
            Object payload = buildLobbyState(room);
            messagingTemplate.convertAndSend(dest, payload);
        }
    }

    /**
     * RECEIVED ALL THE RECEIVED MESSAGE
     * @param roomCode
     * @param playerId
     * @param message
     */
    public void submitMessage(String roomCode, String playerId, String message) {
        Room room = rooms.get(roomCode);
        if (room == null) return;

        synchronized (room) {

            //the room stage must be in the speaking
            if (room.getStatus() != RoomStatus.SPEAKING) return;

            //the maxmum of the message is 30
            if (message == null) message = "";
            message = message.trim();
            if (message.length() > 30) {
                message = message.substring(0, 30);
            }
            if (message.isEmpty()) return;

            // the player must exists
            boolean exists = room.getPlayers().stream().anyMatch(p -> p.getId().equals(playerId));
            if (!exists) return;

            // each round can only message once
            if (room.getSpokeThisRound().contains(playerId)) return;

            // write down all the message
            room.getSpokeThisRound().add(playerId);
            room.getRoundMessages().put(playerId, message);

            //log the info
            System.out.println("收到发言: room=" + roomCode + " player=" + playerId + " msg=" + message);

            //判断是否收齐（所有玩家and ai都要发）
            int humanNeed = (int) room.getPlayers().stream()
                    .filter(p -> !p.getId().startsWith("ai_")) // 临时判断：id 前缀
                    .count();

            int got = room.getRoundMessages().size();

            //when all human message is collected and we are gona to send human message
            if (got >= humanNeed && room.getAiId() != null && !room.getSpokeThisRound().contains(room.getAiId())) {
                var visible = room.getRoundMessages().values().stream().toList();
                String aiText = aiService.generateAiMessage(
                        room.getPremise(),
                        room.getRound(),
                        visible,
                        30
                );
                // 直接添加 AI 消息，不递归调用
                room.getSpokeThisRound().add(room.getAiId());
                room.getRoundMessages().put(room.getAiId(), aiText);
                got = room.getRoundMessages().size();
            }

            // publich the message and state to the client
            int totalNeed = humanNeed + (room.getAiId() == null ? 0 : 1);
            if (got >= totalNeed) {
                broadcastRoundMessages(room);
                room.setStatus(RoomStatus.VOTING);
                // 同时广播 state（前端切 UI），已经status换成了voting所以需要切换ui
                String dest = "/topic/room/" + roomCode + "/state";
                Object payload = buildLobbyState(room);
                messagingTemplate.convertAndSend(dest, payload);
                // 清理本轮缓存
                room.getRoundMessages().clear();
                room.getSpokeThisRound().clear();
            }
        }
    }

    /**
     * BROAD CAST ALL THE MESSAGE TO THE CLIENT
     * @param room
     */
    private void broadcastRoundMessages(Room room) {
        String dest = "/topic/room/" + room.getCode() + "/round-messages";

        // 将消息转换为列表并打乱顺序
        var messageList = room.getRoundMessages().entrySet().stream()
                .map(e -> Map.of("playerId", e.getKey(), "text", e.getValue()))
                .toList();

        // shuffled message for all the human
        var shuffledMessages = new java.util.ArrayList<>(messageList);
        java.util.Collections.shuffle(shuffledMessages, random);

        // payload: round + 打乱后的messages数组
        Object payload = Map.of(
                "round", room.getRound(),
                "messages", shuffledMessages
        );

        messagingTemplate.convertAndSend(dest, payload);
        System.out.println("广播 round-messages: room=" + room.getCode());
    }


    /**
     * SUBMIT VOTE
     * @param roomCode
     * @param voterId
     * @param targetId
     */
    public void submitVote(String roomCode, String voterId, String targetId) {
        Room room = rooms.get(roomCode);
        if (room == null) return;

        synchronized (room) {

            // check if in the voting stage
            if (room.getStatus() != RoomStatus.VOTING) return;

            // check if the voterid exist
            boolean voterExists = room.getPlayers().stream().anyMatch(p -> p.getId().equals(voterId));
            if (!voterExists) return;

            // check if the target exist
            boolean targetExists = room.getPlayers().stream().anyMatch(p -> p.getId().equals(targetId));
            if (!targetExists) return;

            // you can't vote yourself
            if (voterId.equals(targetId)) return;

            // avoid repeated vote
            if (room.getVotedThisRound().contains(voterId)) return;

            // record the vote
            room.getVotedThisRound().add(voterId);
            room.getVoteCount().merge(targetId, 1, Integer::sum);

            System.out.println("收到投票: room=" + roomCode + " voter=" + voterId + " target=" + targetId);

            // after all the human done ai vote
            int humanNeed = (int) room.getPlayers().stream()
                    .filter(p -> !p.getId().startsWith("ai_"))
                    .count();

            int votedHuman = (int) room.getVotedThisRound().stream()
                    .filter(id -> !id.startsWith("ai_"))
                    .count();

            // 人类投完但 AI 没投 -> AI 自动投（直接添加，不递归）
            if (votedHuman >= humanNeed && room.getAiId() != null && !room.getVotedThisRound().contains(room.getAiId())) {
                String aiVoteTarget = pickRandomVoteTarget(room, room.getAiId());

                // 直接添加 AI 投票，不递归调用
                room.getVotedThisRound().add(room.getAiId());
                room.getVoteCount().merge(aiVoteTarget, 1, Integer::sum);
                System.out.println("AI voted: room=" + roomCode + " ai=" + room.getAiId() + " target=" + aiVoteTarget);
            }

            // 当所有（人类+AI）都投完 -> 结算
            int totalNeed = humanNeed + (room.getAiId() == null ? 0 : 1);
            int got = room.getVotedThisRound().size();

            if (got >= totalNeed) {
                finishVoting(room);
            }
        }
    }

    // 辅助函数
    private String pickRandomVoteTarget(Room room, String voterId) {
        var candidates = room.getPlayers().stream()
                .map(Player::getId)
                .filter(id -> !id.equals(voterId))
                .toList();

        if (candidates.isEmpty()) return voterId; // 兜底
        return candidates.get(random.nextInt(candidates.size()));
    }

    //辅助函数
    private void finishVoting(Room room) {
        String roomCode = room.getCode();

        // find the max vote
        int max = 0;
        for (int v : room.getVoteCount().values()) {
            if (v > max) max = v;
        }

        // if tie
        if (max == 0) {
            broadcastTieAndNextRound(room, "NO_VOTES");
            return;
        }

        //  find the high vote
        final int  maxNum = max;
        var top = room.getVoteCount().entrySet().stream()
                .filter(e -> e.getValue() == maxNum)
                .map(Map.Entry::getKey)
                .toList();

        // if tie
        if (top.size() >= 2) {
            broadcastTieAndNextRound(room, "TIE");
            return;
        }

        //if only one high vote
        String eliminatedId = top.get(0);

        //publich to the client
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomCode + "/vote-result",
                (Object)Map.of(
                        "round", room.getRound(),
                        "voteCount", room.getVoteCount(),
                        "eliminatedId", eliminatedId,
                        "tie", false
                )
        );

        // if if the ai is elimite
        if (eliminatedId.equals(room.getAiId())) {
            room.setStatus(RoomStatus.ENDED); //
            // 也可以广播 winner
            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomCode + "/state",
                    (Object)buildLobbyState(room)
            );
            rooms.remove(roomCode);// REMOVE THE ROOMCODE
            clearVotingCache(room);
            return;
        }

        // player is been vote out
        final String elim = eliminatedId;
        room.getPlayers().removeIf(p -> p.getId().equals(elim));

        // AI 胜利条件：只剩 AI + 1 人（淘汰后再算）
        int humanAlive = (int) room.getPlayers().stream()
                .filter(p -> !p.getId().startsWith("ai_"))
                .count();

        boolean aiStillAlive = room.getAiId() != null &&
                room.getPlayers().stream().anyMatch(p -> p.getId().equals(room.getAiId()));

        if (aiStillAlive && humanAlive <= 1) {
            room.setStatus(RoomStatus.ENDED);
            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomCode + "/state",
                    (Object) buildLobbyState(room)
            );
            rooms.remove(roomCode);
            clearVotingCache(room);
            return;
        }

        //next round turn and state to SPEAKING
        room.setRound(room.getRound() + 1);
        room.setStatus(RoomStatus.SPEAKING);

        clearVotingCache(room);

        // 清理发言缓存
        room.getRoundMessages().clear();
        room.getSpokeThisRound().clear();

        // publich  state
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomCode + "/state",
                (Object)buildLobbyState(room)
        );
    }

    private void broadcastTieAndNextRound(Room room, String reason) {
        String roomCode = room.getCode();

        // publich vote-result：tie=true，没有 eliminatedId
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomCode + "/vote-result",
                (Object)Map.of(
                        "round", room.getRound(),
                        "voteCount", room.getVoteCount(),
                        "eliminatedId", "",
                        "tie", true,
                        "reason", reason
                )
        );

        // 下一轮
        room.setRound(room.getRound() + 1);
        room.setStatus(RoomStatus.SPEAKING);

        clearVotingCache(room);

        room.getRoundMessages().clear();
        room.getSpokeThisRound().clear();

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomCode + "/state",
                (Object)buildLobbyState(room)
        );
    }

    private void clearVotingCache(Room room) {
        room.getVoteCount().clear();
        room.getVotedThisRound().clear();
    }

    /**
     * DELETE THE ROOM WHEN SOMEONE OFFLINE
     * @param roomCode
     * @param playerId
     */
    public void terminateRoomDueToDisconnect(String roomCode, String playerId) {
        Room room = rooms.get(roomCode);
        if (room == null) return;

        synchronized (room) {
            // check if the game is already end
            if (room.getStatus() == RoomStatus.ENDED) return;

            room.setStatus(RoomStatus.ENDED);

            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomCode + "/terminated",
                    (Object) Map.of(
                            "reason", "PLAYER_DISCONNECTED",
                            "playerId", playerId
                    )
            );

            // 广播 state，让前端切到结束页面
            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomCode + "/state",
                    (Object) buildLobbyState(room)
            );
        }

        // clean up（在同步块外，避免持有锁太久）
        rooms.remove(roomCode);
    }
}