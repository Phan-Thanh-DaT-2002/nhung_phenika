package com.neo.common.constants;

/**
 * @author NEO Team
 * @Email @neo.vn
 * @Version 1.0.0
 */

public class ResponseFontendDefine {

	public static final int GENERAL = 999;
	// thành công
	public static final int CODE_SUCCESS = 0;

	// exception không có quyền truy cập tài nguyên
	public static final int CODE_PERMISSION = 1;

	// exception không tìm thấy entity
	public static final int CODE_NOT_FOUND = 2;

	// exception name/code đã tồn tại
	public static final int CODE_ALREADY_EXIST = 3;
	
 
	public static final int CODE_ALREADY_EXIST_LIGHT_NAME = 31;
	
	public static final int CODE_ALREADY_EXIST_LIGHT_CODE = 32;
	
	public static final int CODE_ALREADY_EXIST_LIGHT_SERIAL = 33;
	
	public static final int CODE_ALREADY_EXIST_LIGHT_MAC = 34;
	
	public static final int CODE_ALREADY_EXIST_LIGHT_BRANCH_NAME = 35;
	
	public static final int CODE_ALREADY_EXIST_LIGHT_BRANCH_CODE = 36;

	// dùng chung cho các exception xuất hiện khi xử lý nghiệp vụ
	// nếu không muốn mô tả chi tiết
	public static final int CODE_BUSINESS = 4;

	// exception valid dữ liệu khi add/update entity
	public static final int CODE_VALIDATION = 5;

	// exception name/code đã sử dụng
	public static final int CODE_ALREADY_BE_USED = 6;

	// exception call service nội bộ failed
	public static final int CODE_SERVICE_CONNECTION_FAILED = 7;
	
	public static final int BAD_REQUEST_PARAMS=8;
	
	public static final int MAX_NUMBER_OF_MEMBER_EXCEEDED=9;
	
	// exception name đã tồn tại
	public static final int CALL_API_CLOUD_FAIL = 99;
	public static final int NAME_ALREADY_EXIST = 100;
	//exception đăng ký subscription fail
	public static final int REGISTER_SUBSCRIPTION_FAIL = 101;
	//exception tạo Remote CSE
	public static final int CREATE_REMOTE_CSE_FAIL = 102;
	//exception gateway chưa active
	public static final int GATEWAY_DEACTIVE = 103;
	// exception lỗi hệ thống
	public static final int CODE_INTERNAL_ERROR = 9999;
	
	public static final int TARGET_NOT_REACHABLE = 503;
	
	public static final int TARGET_NOT_ONLINE = 504;
	
	public static final int IN_USED = 11;
	
	//exception email không tồn tại
	public static final int TECHNICAL_EMAIL_NOT_EXISTED = 123;
	
	public static final int BUSINESS_EMAIL_NOT_EXISTED = 124;
	
	public static final int PARTNER_EMAIL_NOT_EXISTED = 125;


}
