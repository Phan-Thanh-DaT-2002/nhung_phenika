package com.neo.core.exceptions;

import java.util.HashMap;
import java.util.Map;

import lombok.Builder;

@Builder
public class BusinessError {
    public String message;
    public Map<String, String> values;

    public BusinessError(String message) {
        this.message = message;
        this.values = new HashMap<>();
    }
    public BusinessError(String message,String value) {
        this.message = message;
        this.values = new HashMap<>();
    }

    public BusinessError(String message, Map<String, String> values) {
        this.message = message;
        this.values = values;
    }
}
