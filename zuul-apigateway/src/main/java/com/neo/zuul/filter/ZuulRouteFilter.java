package com.neo.zuul.filter;

import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.exception.ZuulException;

import lombok.extern.slf4j.Slf4j;

/**
 * @author NEO Team
 * @Email: @neo.vn
 * @Version 1.0.0 Dec 24, 2020
 */

@Component
@Slf4j
public class ZuulRouteFilter extends ZuulFilter {

	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() throws ZuulException {
		log.info("ZuulRouteFilter.class Route Filter");
		return null;
	}

	@Override
	public String filterType() {
		return "route";
	}

	@Override
	public int filterOrder() {
		return 1;
	}

}
