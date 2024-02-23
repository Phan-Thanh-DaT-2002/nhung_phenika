package com.neo.core.controllers;

import com.google.common.base.Strings;
import com.neo.core.constants.ResponseFontendDefine;
import com.neo.core.dto.PagingResponse;
import com.neo.core.dto.ResponseModel;
import com.neo.core.dto.logactionDTO;
import com.neo.core.entities.logaction;
import com.neo.core.service.Logactionservice;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("log-act")
@Slf4j
@CrossOrigin("*")//
public class LogactControler extends BaseController {
    private final String START_LOG = "UserInfo {}";
    private final String END_LOG = "UserInfo {} finished in: {}";
    private final HttpServletRequest request;

    public LogactControler(HttpServletRequest request){
        this.request = request;
    }


    @Autowired
    Logactionservice service;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping()
    public ResponseModel doSearch(
                                  @RequestParam(value = "deviceCode", required = false) String deviceCode,
                                  @RequestParam(value = "fromDate", required = false) String fromDate,
                                  @RequestParam(value = "toDate", required = false) String toDate,
                                  @RequestParam(defaultValue = "0") int currentPage,
                                  @RequestParam(defaultValue = "10") int perPage){
        Pageable paging = PageRequest.of(currentPage, perPage);
        final String action = "doSearch";
        StopWatch sw = new StopWatch();
        sw.start();
        log.info(START_LOG, action);
        try {
            Page<logactionDTO> pageResult = null;

            // Nếu  rỗng hoặc chỉ chứa khoảng trắng, đặt  = null
            if (deviceCode != null && deviceCode.trim().isEmpty()) {
                deviceCode = null;
            }
            if (fromDate != null && fromDate.trim().isEmpty()) {
                fromDate = null;
            }
            if (toDate != null && toDate.trim().isEmpty()) {
                toDate = null;
            }

            pageResult = service.doSearch(
                    Strings.emptyToNull(deviceCode),
                    Strings.emptyToNull(fromDate),
                    Strings.emptyToNull(toDate),
                    paging);
            if ((pageResult == null || pageResult.isEmpty())) {
                ResponseModel responseModel = new ResponseModel();
                responseModel.setMessages("Không tìm thấy thiết bị.");
                responseModel.setStatusCode(HttpStatus.SC_OK+"");
                responseModel.setCode(ResponseFontendDefine.CODE_NOT_FOUND+"");
                return responseModel;
            }
            PagingResponse<logactionDTO> result = new PagingResponse<>();
            result.setTotal(pageResult.getTotalElements());
            result.setItems(pageResult.getContent());

            ResponseModel responseModel = new ResponseModel();
            responseModel.setContent(result);
            responseModel.setStatusCode(HttpStatus.SC_OK+"");
            responseModel.setCode(ResponseFontendDefine.CODE_SUCCESS+"");
            return responseModel;
        } catch (Exception e) {
            throw (e);
        } finally {
            sw.stop();
            log.info(END_LOG, action, sw.getTotalTimeSeconds());
        }
    }
    @PostMapping()
    public ResponseModel doCreate(@RequestBody  logaction entity,  HttpServletRequest request) {
        final String action = "Create";
        StopWatch sw = new StopWatch();
        log.info(START_LOG, action);
        LocalDateTime currentTime = LocalDateTime.now();

        try {
            String customDeviceCode = entity.getDeviceCode().trim();
            Integer customActionStatus= entity.getActionStatus();
            String customActionLog = entity.getActionLog().trim();
            LocalDateTime customTime = entity.getTime();
            String customTitle = entity.getTitle().trim();

            logaction checkExisted = service.findByTime(customTime);
            if (checkExisted != null) {
                if (checkExisted.getTime() != null && checkExisted.getActionStatus() != 0) {
                    ResponseModel responseModel = new ResponseModel();
                    responseModel.setStatusCode(HttpStatus.SC_OK + "");
                    responseModel.setCode(ResponseFontendDefine.CODE_ALREADY_EXIST + "");
                    responseModel.setMessages("Thời gian này đã được setup");
                    return responseModel;
                }
            } else {
                    entity.setDeviceCode(customDeviceCode);
                    entity.setActionLog(customActionLog);
                    entity.setActionStatus(customActionStatus);
                    entity.setTime(customTime);
                    entity.setCreatedDate(currentTime);
                    entity.setUpdateDate(currentTime);
                    entity.setTitle(customTitle);
                    service.create(entity);
                }
                messagingTemplate.convertAndSend("/topic/log-act/create", "Log action created!");
                ResponseModel responseModel = new ResponseModel();
                responseModel.setStatusCode(HttpStatus.SC_OK + "");
                responseModel.setCode(ResponseFontendDefine.CODE_SUCCESS + "");
                return responseModel;

            } catch (Exception e) {
            throw handleException(e);
        } finally {
            log.info(END_LOG, action, sw.getTotalTimeSeconds());
        }
    }

    @PutMapping("/edit")
    public ResponseModel doUpdate(@RequestBody logaction dto, HttpServletRequest request) {
        final String action = "Update";
        StopWatch sw = new StopWatch();
        log.info(START_LOG, action);
        LocalDateTime currentTime = LocalDateTime.now();
            try {
                logaction entity = service.retrieve(dto.getId());
                entity.setDeviceCode(dto.getDeviceCode());
                entity.setActionStatus(dto.getActionStatus());
                entity.setActionLog(dto.getActionLog());
                entity.setTime(dto.getTime());
                entity.setUpdateDate(currentTime);
                entity.setTitle(dto.getTitle());
                service.update(entity, entity.getId());
                ResponseModel responseModel = new ResponseModel();
                responseModel.setStatusCode(HttpStatus.SC_OK+""+"");
                responseModel.setCode(ResponseFontendDefine.CODE_SUCCESS+"");
                return responseModel;
            } catch (Exception e) {
                throw handleException(e);
            } finally {
                log.info(END_LOG, action, sw.getTotalTimeSeconds());
            }
    }


    @PatchMapping("/delete-multiple")
    public ResponseModel doDelete(@RequestBody List<Long> ids) {
        return service.deleteMultiple(ids,request);
    }
}
