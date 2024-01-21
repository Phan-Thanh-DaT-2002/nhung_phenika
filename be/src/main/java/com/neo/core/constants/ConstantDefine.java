package com.neo.core.constants;

/**
 * @author NEO Team
 * @Email @neo.vn
 * @Version 1.0.0 Sep 3, 2020
 */

public class ConstantDefine {
	
	public static final int MAX_THREAD_POOL_SIZE = 100;
	
	public static class STATUS{
		public static final Integer ACTIVE = 1;
		public static final Integer NOT_DELETE = 0;
		public static final Integer NOT_Undo = 1;
		public static final Integer UNDO_CREATE = 1;
		public static final Integer DELETED = 0;
		public static final Integer LOCKED = 2;
		public static final Integer UNDO_NEW = 0;
		public static final Integer UNDO_UPDATE = 1;
		public static final Integer CAN_NOT_UNDO = 0;
		public static final Integer CAN_BE_UNDO = 1;
	}
	
	public static class QUESTION_NOANSWER_STATUS{
		public static final Integer ACTIVE = 1;
		public static final Integer NOTIFIED = 2;
	}
	
	public static class NOTIFY_TYPE{
		public static final Integer WAITING_APPROVE = 1;
		public static final Integer APPROVED = 2;
		public static final Integer REJECT = 3;
		public static final Integer QUESTION_NOANSVWER = 4;
	}
	
	public static class NOTIFY_STATUS{
		public static final Integer ACTIVE = 1;
		public static final Integer SEEN = 0;
	}
	
	public static class DATA_TYPE{
		public static final String INT = "INT";
		public static final String VARCHAR = "VARCHAR";
		public static final String DATETIME = "DATETIME";
	}
	
	public static class STANDARD_CRITERIA_TYPE {
		public static final Integer STANDARD = 1;
		public static final Integer CRITERIA = 2;
	}
	
	public static class FILE_PATH{
		public static String EXHIBITION = "";
		public static String COLLECTION = "";
		public static String DOCUMENT = "";
		public static String ASSESSMENT = "";

		public static String OPEN_PROOF = "";

		public static String IMAGE_PATH = "";

		public static String DEFAULT_PATH = "";

		public static String REPORT = "";
		public static String ORC = "";
	}
	
	public static class FRONTEND_PATH{
		public static String RESET_PASSWORD_URL = "";
	}
	
	public static class IS_DIRECTORY{
		public static final Integer TRUE = 1;
		public static final Integer FALSE = 0;
	}
	
	public static class IS_DELETED {
		public static final Integer TRUE = 1;
		public static final Integer FALSE = 0;
	}
	
	public static class LANGUAGE {
		public static final String VN = "vi";
		public static final String EN = "en";
	}
}
