package com.neo.zuul.filter;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.neo.common.constants.ErrorMessageDefine;
import com.neo.common.constants.ResponseFontendDefine;
import com.neo.common.dto.ResponseModel;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

import lombok.extern.slf4j.Slf4j;

/**
 * @author NEO Team
 * @Email: @neo.vn
 * @Version 1.0.0 Dec 24, 2020
 */

@Component
@Slf4j
public class ZuulErrorFilter extends ZuulFilter {

	private static final String FILTER_TYPE = "error";
	private static final String THROWABLE_KEY = "throwable";
	private static final int FILTER_ORDER = -1;

	@Override
	public String filterType() {
		return FILTER_TYPE;
	}

	@Override
	public int filterOrder() {
		return FILTER_ORDER;
	}

	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() {
		final RequestContext context = RequestContext.getCurrentContext();
		final Object throwable = context.get(THROWABLE_KEY);
		log.info("ZuulErrorFilter.class: Inside Route Filter");
		if (throwable instanceof ZuulException) {
			final ZuulException zuulException = (ZuulException) throwable;
			log.error("Zuul failure detected: " + zuulException.getMessage());

			// remove error code to prevent further error handling in follow up filters
			context.remove(THROWABLE_KEY);

			// Response to body
			Map<String, String> json = new HashMap<String, String>();
			json.put("ZUUL_PROXY_ERROR", "FORWARDING ERROR OR READ TIMEOUT");
			ResponseModel responseModel = new ResponseModel();
			responseModel.setErrorMessages(ErrorMessageDefine.ZUUL_PROXY);
			responseModel.setStatusCode(HttpServletResponse.SC_SERVICE_UNAVAILABLE); // 503
			responseModel.setCode(ResponseFontendDefine.CODE_SERVICE_CONNECTION_FAILED);
			responseModel.setContent(json);

			try {
				String jsonObj = new ObjectMapper().writeValueAsString(responseModel);
				context.setResponseBody(jsonObj);
				context.getResponse().setContentType("application/json");
				context.setResponseStatusCode(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
			} catch (JsonProcessingException e) {
				context.setResponseBody("Overriding Zuul Exception Body");
			}
		}
		return null;
	}

}
