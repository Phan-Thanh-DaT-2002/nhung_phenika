package com.neo.core.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "logaction")
@FieldNameConstants
@Data
@NoArgsConstructor
@AllArgsConstructor
public class logaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private Long id;

    @Column(name = "DEVICECODE")
    private String deviceCode;

    @Column(name = "ACTIONSTATUS")
    private Integer actionStatus;

    @Column(name = "ACTIONLOG")
    private String actionLog;

    @Column(name = "TIME")
    private LocalDateTime time;

    @Column(name = "CREATEDDATE")
    private LocalDateTime createdDate;

    @Column(name = "UPDATEDATE")
    private LocalDateTime updateDate;
}
