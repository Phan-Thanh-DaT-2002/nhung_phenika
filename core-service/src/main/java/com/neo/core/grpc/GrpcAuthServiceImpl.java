//package com.neo.auth.grpc;
//
//import com.neo.protocol.grpc.GrpcAuthServiceGrpc.GrpcAuthServiceImplBase;
//
//import lombok.extern.slf4j.Slf4j;
//
///**
// * Endpoint to handler Authentication User via gRPC
// */
//@Slf4j
//public class GrpcAuthServiceImpl extends GrpcAuthServiceImplBase {


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
//	String activeUserPage;
//	
//	public GrpcAuthServiceImpl(RoleServiceImpl roleServiceImpl, PrivilegesServiceImpl privilegesServiceImpl,
//			UserServiceImpl userServiceImpl, PasswordEncoder passwordEncoder,MailService mailService,String activeUserPage) {
//		this.roleServiceImpl = roleServiceImpl;
//		this.privilegesServiceImpl = privilegesServiceImpl;
//		this.userServiceImpl = userServiceImpl;
//		this.passwordEncoder = passwordEncoder;
//		this.mailService=mailService;	
//		this.activeUserPage=activeUserPage;
//	}
//
//	@Override
//	public void retrieveRoleById(RoleRequest request, StreamObserver<RoleResponse> responseObserver) {
//
//		log.info("start retrieveRoleById via GRPC ...");
//		RoleResponse response = null;
//		try {
//			int id = request.getId();
//			Optional<RoleModel> op = roleServiceImpl.findById(id);
//			RoleModel roleModel = null;
//
//			if (op.isPresent()) {
//				roleModel = op.get();
//				List<PrivilegesModel> ls = roleModel.getPrivileges();
//
//				if (ls != null) {
//					List<Privileges> lpv = new ArrayList<Privileges>();
//					for (PrivilegesModel pm : ls) {
//						com.mbf.customercare.protocol.grpc.AuthenticationService.Privileges pv = Privileges
//								.newBuilder().setGroup(pm.getGroup()).setId(pm.getId()).setKey(pm.getKey())
//								.setValue(pm.getValue()).build();
//						lpv.add(pv);
//					}
//
//					response = RoleResponse.newBuilder().setId(id).setName(roleModel.getName()).addAllPrivileges(lpv)
//							.build();
//				}
//
//			}
//		} catch (Exception e) {
//			log.error(e.getMessage());
//		} finally {
//			responseObserver.onNext(response);
//			responseObserver.onCompleted();
//		}
//
//	}
//
//	@Override
//	public void createUser(CreateUserRequest request, StreamObserver<CreateUserResponse> responseObserver) {
//
//		log.info("start create user via GRPC ...");
//
//		CreateUserResponse response = null;
//		try {
//			UserModel dto = new UserModel();
//			dto.setFullname(request.getFullname());
//			dto.setEmail(request.getEmail());
//			dto.setPassword(request.getPassword());
//			dto.setLoginId(request.getLoginId());
//			if (userServiceImpl.findByEmailOrLoginId(request.getEmail(), request.getLoginId()) != null) {
//				response = CreateUserResponse.newBuilder().setCode(Response.CODE_ALREADY_EXIST)
//						.setStatusMessage(ErrorMessageDefine.ACC_EMAIL_OR_LOGINID_ALREADY_EXIST).build();
//				responseObserver.onNext(response);
//				responseObserver.onCompleted();
//				return;
//			}
//			dto.setPhone(request.getPhone());
//			String rawPass = dto.getPassword();
//			dto.setPassword(passwordEncoder.encode(rawPass));
//			String verifyToken = UUID.randomUUID().toString();
//			dto.setVerifyToken(verifyToken);
//			dto.setVerifyTokenCreatedDate(LocalDateTime.now());
//			List<Integer> roleIds = request.getRoleIdsList();
//			List<RoleModel> ls = roleServiceImpl.findList(roleIds);
//			dto.setRoles(ls);
//			// user type
//			dto.setType(UserTypeEnum.getUserTypeEnum(request.getAccountType()));
//			//try to send email to user for confirm active user
//			response = CreateUserResponse.newBuilder().setCode(Response.CODE_SUCCESS).build();
//	        String verifyTokenUrl = activeUserPage + "/" + verifyToken;
//	        Map<String, String> data = new HashMap<>();
//	        data.put("loginId", dto.getLoginId());
//			data.put("password", rawPass);
//			data.put("verifyTokenUrl", verifyTokenUrl);
//		 
//			mailService.sendConfirmAccountHtmlMail(new String[] {dto.getEmail()}, data);
//		 //send email OK - > go to create user 
//			userServiceImpl.create(dto);
//			
//		} catch (Exception e) {
//			log.error(e.getMessage());
//			response = CreateUserResponse.newBuilder().setCode(Response.CODE_INTERNAL_ERROR).build();
//		} finally {
//			responseObserver.onNext(response);
//			responseObserver.onCompleted();
//		}
//		;
//
//	}
//
//	@Override
//	public void updateUser(UpdateUserRequest request, StreamObserver<UpdateUserResponse> responseObserver) {
//		log.info("start updateUser via GRPC ...");
//		UpdateUserResponse response = null;
//		try {
//			UserModel dto = new UserModel();
//			if (request.getFullname() != null)
//				dto.setFullname(request.getFullname());
//			if (request.getEmail() != null)
//				dto.setEmail(request.getEmail());
//			if (request.getPhone() != null)
//				dto.setPhone(request.getPhone());
//
//			List<Integer> roleIds = request.getRoleIdsList();
//			if (roleIds != null && !roleIds.isEmpty()) {
//				List<RoleModel> ls = roleServiceImpl.findList(roleIds);
//				dto.setRoles(ls);
//			}
//			userServiceImpl.update(request.getLoginId(), dto);
//			response = UpdateUserResponse.newBuilder().setCode(Response.CODE_SUCCESS).build();
//
//		} catch (Exception e) {
//			log.error(e.getMessage());
//			response = UpdateUserResponse.newBuilder().setCode(Response.CODE_INTERNAL_ERROR)
//					.setStatusMessage(e.getMessage()).build();
//		} finally {
//			responseObserver.onNext(response);
//			responseObserver.onCompleted();
//		}
//
//	}
//
//	@Override
//	public void retrieveUser(RetrieveUserRequest request, StreamObserver<RetrieveUserResponse> responseObserver) {
//
//		log.info("retrieve user via grpc");
//		RetrieveUserResponse response = null;
//
//		try {
//			int id = request.getId();
//			Optional<UserModel> authUser = userServiceImpl.findById(id);
//			UserModel userModel = null;
//			if (authUser.isPresent()) {
//				userModel = authUser.get();
//				response = RetrieveUserResponse.newBuilder().setAdmin(userModel.isAdmin())
//						.setEmail(userModel.getEmail()).setFullname(userModel.getFullname())
//						.setLoginId(userModel.getLoginId()).setStatus(userModel.getStatus().name()).build();
//
//			}
//
//		} catch (Exception e) {
//			log.error(e.getMessage());
//		} finally {
//			responseObserver.onNext(response);
//			responseObserver.onCompleted();
//		}
//
//	}
//
//	@Override
//	public void retrieveRoleByLoginId(UserRequest request, StreamObserver<RetrieveUserResponse> responseObserver) {
//		// TODO Auto-generated method stub
//		log.info("retrieve user via grpc");
//		RetrieveUserResponse response = null;
//
//		try {
//			String id = request.getLoginId();
//			Optional<UserModel> op = userServiceImpl.findByLoginId(id);
//			if (op.isPresent()) {
//				UserModel userModel = op.get();
//				List<RoleModel> roleModels = userModel.getRoles();
//				List<RoleResponse> roleResponses = new ArrayList<RoleResponse>();
//				if (roleModels != null && !roleModels.isEmpty()) {
//					for (RoleModel rmd : roleModels) {
//						List<PrivilegesModel> ls =privilegesServiceImpl.findByRoleId(rmd.getId());
//						if (ls != null) {
//							List<Privileges> lpv = new ArrayList<Privileges>();
//							for (PrivilegesModel pm : ls) {
//								com.mbf.customercare.protocol.grpc.AuthenticationService.Privileges pv = Privileges
//										.newBuilder().setGroup(pm.getGroup()).setId(pm.getId()).setKey(pm.getKey())
//										//.setValue(pm.getValue())
//										.build();
//								lpv.add(pv);
//							}
//							RoleResponse roleResponse = RoleResponse.newBuilder().setId(rmd.getId())
//									.setName(rmd.getName()).addAllPrivileges(lpv).build();
//							roleResponses.add(roleResponse);
//						}
//					}
//					response = RetrieveUserResponse.newBuilder().setAdmin(userModel.isAdmin())
//							.setEmail(userModel.getEmail()).setFullname(userModel.getFullname())
//							.setLoginId(userModel.getLoginId()).setStatus(userModel.getStatus().name())
//							.addAllRoles(roleResponses).build();
//				}
//
//			}
//		} catch (Exception e) {
//			log.error(e.getMessage());
//		} finally {
//			responseObserver.onNext(response);
//			responseObserver.onCompleted();
//		}
//
//	}
//
//	@Override
//	public void deleteUser(UserRequest request, StreamObserver<DeleteUserResponse> responseObserver) {
//	 
//		//super.deleteUser(request, responseObserver);
//		log.info("delete user via grpc");
//		DeleteUserResponse response = null;
//
//		try {
//			String id = request.getLoginId();
//			Optional<UserModel> op = userServiceImpl.findByLoginId(id);
//			if (!op.isPresent()) {
//				response = DeleteUserResponse.newBuilder().setCode(Response.CODE_INTERNAL_ERROR).setStatusMessage("User not available to delete")
//						 .build();	
//
//			}else {
//				userServiceImpl.delete(op.get().getId());
//				response = DeleteUserResponse.newBuilder().setCode(Response.CODE_SUCCESS).setStatusMessage("Delete user "+id+" succeed")
//						 .build();	
//			}
//		} catch (Exception e) {
//			log.error(e.getMessage());
//		} finally {
//			responseObserver.onNext(response);
//			responseObserver.onCompleted();
//		}
//		
//	}
	
	
//}
