package com.neo.core.service.impl;

import com.neo.core.entities.logaction;
import com.neo.core.repositories.logactionRepositori;
import com.neo.core.service.Logactionservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class Logactionservicempl implements Logactionservice {
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
    public Page<logaction> doSearch( String deviceCode,
                                    String fromDate,
                                    String toDate,
                                     Pageable paging) {

        LocalDateTime dateFrom = null;
        LocalDateTime dateTo = null;
        if(fromDate != null){
            dateFrom = LocalDateTime.parse(fromDate);
        }
        if(toDate != null){
            dateTo = LocalDateTime.parse(toDate);
        }
        return repo.doSearch(deviceCode, dateFrom ,dateTo, paging);
    }
}
