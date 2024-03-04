package com.neo.core.service.impl;

import com.neo.core.constants.ResponseFontendDefine;
import com.neo.core.dto.ResponseModel;
import com.neo.core.dto.logactionDTO;
import com.neo.core.entities.logaction;
import com.neo.core.repositories.logactionRepositori;
import com.neo.core.service.Logactionservice;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class Logactionservicempl implements Logactionservice {

    private final String START_LOG = " start setup mu";
    private final String END_LOG = "end setup mu";

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    logactionRepositori repo;

    @Override
    public logaction create(logaction entity) {
        // TODO Auto-generated method stub
        return repo.save(entity);
    }

    @Override
    public logaction retrieve(Long id) {
        // TODO Auto-generated method stub
        Optional<logaction> entity = repo.findById(id);
        if (!entity.isPresent()) {
            return null;
        }
        return entity.get();
    }

    @Override
    public void update(logaction entity, Long id) {
        // TODO Auto-generated method stub
        repo.save(entity);
    }

    @Override
    public void delete(Long id) {
        // TODO Auto-generated method stub
        repo.deleteById(id);
    }

    @Override
    public ResponseModel createMultiple(List<logaction> DTOs) {
        ResponseModel responseModel = new ResponseModel();
        LocalDateTime currentTime = LocalDateTime.now();
        // tim nhung ban ghi bi trung lap
        for (logaction DTO : DTOs) {
            LocalDateTime customTime = DTO.getTime();
            Optional<logaction> checkExisted = repo.findByTime(customTime);
            if (checkExisted.isPresent()) {
                if (checkExisted.get().getActionStatus() != 0) {
                    responseModel.setStatusCode(HttpStatus.SC_OK + "");
                    responseModel.setCode(ResponseFontendDefine.CODE_ALREADY_EXIST + "");
                    responseModel.setMessages("Thời gian " + customTime + " đã được setup");
                    return responseModel;
                }
            }
        }

            for (logaction DTO : DTOs) {
                // tien hanh them ban ghi
                String customDeviceCode = DTO.getDeviceCode().trim();
                Integer customActionStatus = DTO.getActionStatus();
                String customActionLog = DTO.getActionLog().trim();
                LocalDateTime customTime = DTO.getTime();
                String customTitle = DTO.getTitle().trim();
                DTO.setDeviceCode(customDeviceCode);
                DTO.setActionLog(customActionLog);
                DTO.setActionStatus(customActionStatus);
                DTO.setTime(customTime);
                DTO.setCreatedDate(currentTime);
                DTO.setUpdateDate(currentTime);
                DTO.setTitle(customTitle);
                repo.save(DTO);
            }
            responseModel.setStatusCode(HttpStatus.SC_OK + "");
            responseModel.setCode(ResponseFontendDefine.CODE_SUCCESS + "");
            return responseModel;

    }
    @Override
    public Page<logactionDTO> doSearch(String deviceCode,
                                       String fromDate,
                                       String toDate,
                                       Pageable paging
    ) {

        LocalDateTime dateFrom = null;
        LocalDateTime dateTo = null;
        if(fromDate != null){
            dateFrom = LocalDateTime.parse(fromDate);
        }
        if(toDate != null){
            dateTo = LocalDateTime.parse(toDate);
        }
        return repo.doSearch(deviceCode, dateFrom ,dateTo,paging);

    }

    @Override
    public Page<logactionDTO> doSearchAll(String deviceCode,
                                       String fromDate,
                                       String toDate,
                                       Pageable paging
    ) {

        LocalDateTime dateFrom = null;
        LocalDateTime dateTo = null;
        if(fromDate != null){
            dateFrom = LocalDateTime.parse(fromDate);
        }
        if(toDate != null){
            dateTo = LocalDateTime.parse(toDate);
        }
        return repo.doSearchAll(deviceCode, dateFrom ,dateTo,paging);

    }


    @Override
    public logaction findByTime(LocalDateTime time) {
        // TODO Auto-generated method stub
        Optional<logaction> entity = repo.findByTime(time);
        if (!entity.isPresent()) {
            return null;
        }
        return entity.get();
    }

    @Transactional
    @Override
    public ResponseModel deleteMultiple(List<Long> ids, HttpServletRequest request) {
        final String action = "Do delete";
        StopWatch sw = new StopWatch();
        log.info(START_LOG, action);
        LocalDateTime editDate = LocalDateTime.now();

            for (Long i : ids) {
                repo.softDelete(i, editDate);
            }
            ResponseModel responseModel = new ResponseModel();
            responseModel.setStatusCode(HttpStatus.SC_OK + "");
            responseModel.setCode(ResponseFontendDefine.CODE_SUCCESS + "");
            return responseModel;
    }

}
