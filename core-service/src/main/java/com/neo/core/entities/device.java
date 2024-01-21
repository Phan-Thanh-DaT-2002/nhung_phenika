package com.neo.core.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import javax.persistence.*;

@Entity
@Table(name = "device")
@FieldNameConstants
@Data
@NoArgsConstructor
@AllArgsConstructor
public class device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private Long id;

    @Column(name = "DEVICECODE")
    private String deviceCode;

    @Column(name = "DEVICENAME")
    private String deviceName;
}
