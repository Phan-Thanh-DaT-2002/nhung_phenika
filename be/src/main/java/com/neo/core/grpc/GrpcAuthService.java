//package com.neo.auth.grpc;
//
//public class GrpcAuthService implements Runnable {
//
//	@Override
//	public void run() {
//		// TODO Auto-generated method stub
//
//	}
//	public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
//		this.passwordEncoder = passwordEncoder;
//	}
//
//	private int port;
//	
//	RoleServiceImpl roleServiceImpl;
// 
//	PrivilegesServiceImpl privilegesServiceImpl;
//	
//	UserServiceImpl userServiceImpl;
//	
//	PasswordEncoder passwordEncoder;
//	
//	MailService mailService;
//	
//	String homepage;
//	
//	public void setUserServiceImpl(UserServiceImpl userServiceImpl) {
//		this.userServiceImpl = userServiceImpl;
//	}
//
//	public GrpcAuthService(int port) {
//		this.port=port;
//	}
//
//	@Override
//	public void run() {
//		
//		GrpcAuthServiceImpl authServiceImpl = new GrpcAuthServiceImpl(roleServiceImpl, privilegesServiceImpl,
//				userServiceImpl, passwordEncoder, mailService, homepage);
//	 
//		
//		Server server = ServerBuilder.forPort(port).addService(authServiceImpl).build();
//		try {
//			server.start();
//			server.awaitTermination();
//		} catch (IOException e) {
//
//			e.printStackTrace();
//		} catch (InterruptedException e) {
//
//			e.printStackTrace();
//		}
//
//	}
//
//	public void setRoleServiceImpl(RoleServiceImpl roleServiceImpl) {
//		this.roleServiceImpl = roleServiceImpl;
//	}
//
//	public void setPrivilegesServiceImpl(PrivilegesServiceImpl privilegesServiceImpl) {
//		this.privilegesServiceImpl = privilegesServiceImpl;
//	}
//
//	public void setMailService(MailService mailService) {
//		this.mailService = mailService;
//	}
//
//	public void setHomepage(String homepage) {
//		this.homepage = homepage;
//	}
	
	

//}
