package com.neo.core.service;

import com.neo.core.entities.logaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;


public interface Logactionservice extends IRootService<logaction>  {
    Page<logaction> doSearch(String deviceCode,
                            String fromDate,
                            String toDate,
                             Pageable paging);

    logaction findByTime(LocalDateTime time);
}
