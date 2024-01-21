package com.neo.core.repositories;
import org.springframework.data.domain.Pageable;
import com.neo.core.entities.logaction;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
@Repository
public interface logactionRepositori  extends JpaRepository<logaction, Long> {

    @Query(value = "SELECT new com.neo.core.dto.logactionDTO(v.id, u.deviceCode, u.deviceName, v.actionStatus, v.actionLog, v.time, v.createdDate, v.updateDate) " +
            "FROM device u  left JOIN logaction v ON  u.deviceCode = v.deviceCode Where 1=1" +
            "AND (TRIM(:deviceCode) IS NULL OR LOWER(u.deviceCode) like LOWER(CONCAT('%',TRIM(:deviceCode), '%'))) " +
            "AND (:dateFrom IS NULL OR v.createdDate >= :dateFrom) " +
            "AND (:dateTo IS NULL OR v.createdDate <= :dateTo)  " )
        Page<logaction> doSearch(
            @Param("deviceCode") String deviceCode,
            @Param("dateFrom") LocalDateTime dateFrom,
            @Param("dateTo") LocalDateTime dateTo,
            Pageable paging);
}
