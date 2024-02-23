package com.neo.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class logactionDTO {
    Long id;
    String deviceCode;
    String deviceName;
    Integer actionStatus;
    String actionLog;
    LocalDateTime time;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    String title;
}
