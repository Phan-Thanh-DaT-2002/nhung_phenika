package com.neo.core.util;

public class CommonConstants {

	public static final String PASSWORD_VALID_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,15}$";
	
	public static final String EMAIL_VALID_PATTERN="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
	
	public static final String USERNAME_VALID_PATTERN="^[a-zA-Z0-9_]{1,}$";
	
	public static final String CALL_OUT_APDOMAIN_TYPE = "31";
}
