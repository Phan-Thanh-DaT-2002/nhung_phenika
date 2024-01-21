package com.neo.core.service;

import com.neo.core.entities.logaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface Logactionservice extends IRootService<logaction>  {
    Page<logaction> doSearch(String deviceCode,
                            String fromDate,
                            String toDate,
                             Pageable paging);
}
