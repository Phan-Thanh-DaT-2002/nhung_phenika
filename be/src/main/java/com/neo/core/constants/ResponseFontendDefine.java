package com.neo.core.constants;

/**
 * @author NEO Team
 * @Email @neo.vn
 * @Version 1.0.0
 */

public class ResponseFontendDefine {
	public static final int SQL_EXCEPTION = 500;

	public static final int SQL_EXCEPTION1 = 600;

	public static final int SQL_EXCEPTION2 = 700;
	public static final int GENERAL = 999;
	// thành công
	public static final int CODE_SUCCESS = 0;
	public static final int CODE_SUCCESS1 = 45;

	public static final int MISSING_ATTRIBUTE = 106;

	// exception không có quyền truy cập tài nguyên
	public static final int CODE_PERMISSION = 1;

	// exception không tìm thấy entity
	public static final int CODE_NOT_FOUND = 2;

	// exception name/code đã tồn tại
	public static final int CODE_ALREADY_EXIST = 3;

	// exception yêu câu nhập emai
	public static final int CODE_EMAIL = 15;
	// exception fullname/code đã tồn tại
	public static final int CODE_FULLNAME_EXIST = 4;

	// exception phone/code không đúng định dạng
	public static final int CODE_PHONE_EXIST = 5;

	// exception gmail/code không đúng định dạng
	public static final int CODE_GMAIL_EXIST = 6;

	// exception excel không đúng định dạng
	public static final int EXCEL_WRONG_FORMAT = 7;

	public static final int ALREADY_EXIST_DIRECTORY = 8;

	public static final int ALREADY_EXIST_CRITERIA = 9;

	public static final int ALREADY_EXIST_PROOF = 10;

	public static final int NOT_SAME_CODE = 11;

	public static final int BEING_USED = 12;
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
	// exception valid mật khẩu không chính xác
	public static final int CODE_PASS1 = 10;
	// exception valid mật khẩu không chính xác
	public static final int CODE_PASS2 = 11;

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

	//exception file

	public static final int FILE_NO_CREATE = 178;

	//không được xóa
	public static final int NO_RECORD_DELETED = 30;
	public static final int CODE_CANNOT_DELETE=12;

    public static final Integer NOT_FOUND_APP_PARAMS = 12;

	public static final Integer INVALID_PROOF_CODE = 13;

	public static final Integer WRONG_FORMAT = 14;

	public static final int CATEGORY_BEING_USED = 100;

	public static final int EXIST_CATEGORY = 101;

	public static final int ORGANIZATION_BEING_USED = 102;

	public static final int EXIST_ORGANIZATION = 103;

	public static final int STANDARD_BEING_USED = 104;

	public static final int EXIST_STANDARD = 105;

	public static final int CRITERIA_BEING_USED = 106;

	public static final int EXIST_CRITERIA = 107;

	public static final int APP_PARAM_BEING_USED = 108;

	public static final int EXIST_APP_PARAM = 109;
	public static final int UNIT = 110;
	public static final int EXIT_UNIT = 111;
	public static final int NOT_FOUND_ORG = 604;
}
