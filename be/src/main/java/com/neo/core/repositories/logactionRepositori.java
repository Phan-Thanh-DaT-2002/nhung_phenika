package com.neo.core.repositories;
import com.neo.core.dto.logactionDTO;
import org.springframework.data.domain.Pageable;
import com.neo.core.entities.logaction;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface logactionRepositori  extends JpaRepository<logaction, Long> {

    @Query(value = "SELECT new com.neo.core.dto.logactionDTO(v.id, u.deviceCode, u.deviceName, v.actionStatus, v.actionLog, v.time, v.createdDate, v.updateDate, v.title) " +
            "FROM logaction v LEFT JOIN device u ON u.deviceCode = v.deviceCode " +
            "WHERE v.actionStatus in(1,2) " +
            "AND (TRIM(:deviceCode) IS NULL OR LOWER(v.deviceCode) LIKE LOWER(CONCAT('%', TRIM(:deviceCode), '%'))) " +
            "AND (:dateFrom IS NULL OR v.createdDate >= :dateFrom) " +
            "AND (:dateTo IS NULL OR v.createdDate <= :dateTo)"+
            "order by v.time asc, v.id asc"
    )
    Page<logactionDTO> doSearch(
            @Param("deviceCode") String deviceCode,
            @Param("dateFrom") LocalDateTime dateFrom,
            @Param("dateTo") LocalDateTime dateTo,
            Pageable paging
    );


    @Query(value = "SELECT new com.neo.core.dto.logactionDTO(v.id, u.deviceCode, u.deviceName, v.actionStatus, v.actionLog, v.time, v.createdDate, v.updateDate, v.title) " +
            "FROM logaction v LEFT JOIN device u ON u.deviceCode = v.deviceCode " +
            "WHERE v.actionStatus in(0)  " +
            "AND (TRIM(:deviceCode) IS NULL OR LOWER(v.deviceCode) LIKE LOWER(CONCAT('%', TRIM(:deviceCode), '%'))) " +
            "AND (:dateFrom IS NULL OR v.createdDate >= :dateFrom) " +
            "AND (:dateTo IS NULL OR v.createdDate <= :dateTo)"+
            "order by v.createdDate desc, v.id desc"
    )
    Page<logactionDTO> doSearchAll(
            @Param("deviceCode") String deviceCode,
            @Param("dateFrom") LocalDateTime dateFrom,
            @Param("dateTo") LocalDateTime dateTo,
            Pageable paging
    );

    @EntityGraph(attributePaths = {logaction.Fields.time})
    Optional<logaction> findByTime(LocalDateTime time);

    @Modifying
    @Query(value = "UPDATE logaction l SET l.actionStatus = 0, l.updateDate = ?2 WHERE l.id = ?1")
    void softDelete(Long groupId, LocalDateTime editDate);
}
