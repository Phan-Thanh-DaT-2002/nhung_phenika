package com.neo.core.exceptions;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

@Getter
public class BusinessException extends Exception {

    private static final long serialVersionUID = -2556322490055461261L;

    public List<BusinessError> errors = new ArrayList<>();
    
    public Integer statusCode =null;

    public BusinessException(String errorMessage) {
        super(errorMessage);
        this.errors.add(new BusinessError(errorMessage));
    }
    public BusinessException(Integer statusCode,String errorMessage) {
        super(errorMessage);
        this.statusCode=statusCode;
        this.errors.add(new BusinessError(errorMessage));
    }

    public BusinessException(BusinessError error) {
        this.errors.add(error);
    }

    public BusinessException(List<BusinessError> errors) {
        this.errors = errors;
    }

    public BusinessException(String errorMessage, Throwable err) {
        super(errorMessage, err);
        this.errors.add(new BusinessError(errorMessage));
    }

}