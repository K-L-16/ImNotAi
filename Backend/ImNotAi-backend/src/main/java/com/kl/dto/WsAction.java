package com.kl.dto;

import lombok.Data;

import java.util.Map;

@Data
public class WsAction {
    private String type;      // "START"
    private String playerId;  // who sent that
    private Map<String, Object> payload; // START DONT NEED SEND THIS ONLY FOR VOTING AND ROUNDED-MESSAGE
}
