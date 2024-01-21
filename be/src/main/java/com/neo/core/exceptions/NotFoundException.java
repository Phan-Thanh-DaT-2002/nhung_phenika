package com.neo.core.exceptions;

public class NotFoundException extends Exception {
	private static final long serialVersionUID = 1L;
	
	public NotFoundException() {
    }
    public NotFoundException(String errorMessage) {
        super(errorMessage);
    }

    public NotFoundException(String errorMessage, Throwable err) {
        super(errorMessage, err);
    }
}
