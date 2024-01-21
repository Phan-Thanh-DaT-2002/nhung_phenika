//package com.neo.core.util;
//
//import javax.servlet.http.HttpServletRequest;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//
//import com.neo.core.config.JwtConfig;
//import com.neo.core.constants.ErrorMessageDefine;
//import com.neo.core.constants.ResponseFontendDefine;
//import com.neo.core.dto.MasterCodeDTO;
//import com.neo.core.exceptions.RalException;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import lombok.extern.slf4j.Slf4j;
//
///**
// * @author NEO Team
// * @Email @neo.vn
// * @Version 1.0.0 Jan 5, 2021
// */
//
//@Slf4j
//public class TokenJWTUtils {
//
//	@Autowired
//	private JwtConfig jwtConfig;
//
//	@Autowired
//	private HttpServletRequest request;
//
//	public MasterCodeDTO getUserNameFromToken() {
//		MasterCodeDTO mc = new MasterCodeDTO();
//		try {
//			String bearerToken = request.getHeader("Authorization").substring(7);
//			// use getBytes();
//			Claims claims = Jwts.parser().setSigningKey(jwtConfig.getSecret().getBytes()).parseClaimsJws(bearerToken)
//					.getBody();
////			String name = claims.getSubject();
//			String name = claims.get("name").toString();
//			String id = claims.get("id").toString();
//			log.info("Created by: " + name + " id: " + id);
//			mc.setKey(id);
//			mc.setValue(name);
//
//		} catch (Exception e) {
//			log.error(e.getMessage());
//			throw new RalException(HttpStatus.OK.value(), ResponseFontendDefine.CODE_BUSINESS, ErrorMessageDefine.ACC_FORBIDDEN);
//		}
//		return mc;
//	}
//}
