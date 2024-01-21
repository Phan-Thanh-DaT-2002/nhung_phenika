package com.neo.zuul.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neo.common.constants.ErrorMessageDefine;
import com.neo.common.constants.ResponseFontendDefine;
import com.neo.common.dto.ResponseModel;

import lombok.extern.slf4j.Slf4j;

/**
 * @author NEO Team
 * @Email: @neo.vn
 * @Version 1.0.0
 */

@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
	@Override
	public void commence(HttpServletRequest httpServletRequest, HttpServletResponse response, AuthenticationException e)
			throws IOException, ServletException {
		log.warn("JwtAuthenticationEntryPoint:UNAUTHORIZED");
		// Response to body
		Map<String, String> json = new HashMap<String, String>();
		json.put("TOKEN", "WRONG");
		ResponseModel responseModel = new ResponseModel();
		responseModel.setErrorMessages(ErrorMessageDefine.ACC_FORBIDDEN);
		responseModel.setStatusCode(HttpServletResponse.SC_UNAUTHORIZED);
		responseModel.setCode(ResponseFontendDefine.CODE_PERMISSION);
		responseModel.setContent(json);

		byte[] body = new ObjectMapper().writeValueAsBytes(responseModel);
		response.getOutputStream().write(body);
	}
}