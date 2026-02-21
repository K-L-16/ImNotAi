package com.kl.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PLAYER POJO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    public String id;
    public boolean isHost;
}
