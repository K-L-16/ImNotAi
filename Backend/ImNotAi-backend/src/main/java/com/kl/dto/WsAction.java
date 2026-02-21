package com.kl.dto;

import lombok.Data;

import java.util.Map;

@Data
public class WsAction {
    private String type;      // "START"
    private String playerId;  // who sent that
    private Map<String, Object> payload; // START 先用不到
}
