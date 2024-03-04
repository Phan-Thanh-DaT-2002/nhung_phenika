package com.neo.core.service;

import com.neo.core.dto.ResponseModel;
import com.neo.core.dto.logactionDTO;
import com.neo.core.entities.logaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;


public interface Logactionservice extends IRootService<logaction>  {
    Page<logactionDTO> doSearch(String deviceCode,
                                String fromDate,
                                String toDate,
                                Pageable paging
    );

    Page<logactionDTO> doSearchAll(String deviceCode,
                                String fromDate,
                                String toDate,
                                Pageable paging
    );

    logaction findByTime(LocalDateTime time);

    ResponseModel deleteMultiple(List<Long> ids, HttpServletRequest request);

    ResponseModel createMultiple(List<logaction> DTOs);

}
