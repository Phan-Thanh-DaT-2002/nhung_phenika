package com.neo.zuul.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

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
public class ZuulPostFilter extends ZuulFilter {

	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() throws ZuulException {
		log.info("ZuulPostFilter.class: Inside Response Filter");
		RequestContext ctx = RequestContext.getCurrentContext();
		HttpServletRequest request = ctx.getRequest();
		HttpServletResponse response = ctx.getResponse();
		log.info("Request Method : " + request.getMethod() + " Request URL : " + request.getRequestURL().toString()
				+ " Response Status : " + response.getStatus());
		return null;
	}

	@Override
	public String filterType() {
		return "post";
	}

	@Override
	public int filterOrder() {
		return 1;
	}

}
