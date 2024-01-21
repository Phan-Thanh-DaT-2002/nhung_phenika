package com.neo.core.config;

import org.springframework.beans.factory.annotation.Value;

import lombok.Data;

/**
 * @author NEO Team
 * @Email @neo.vn
 * @Version 1.0.0
 */

@Data
public class JwtConfig {

	// Link: https://stackoverflow.com/a/6897406
	@Value("${security.jwt.uri:/login}")
	private String Uri;

	@Value("${security.jwt.header:Authorization}")
	private String header;

	@Value("${security.jwt.prefix:Bearer }")
	private String prefix;

	@Value("${security.jwt.expiration:#{24*60*60}}")
	private int expiration;

	@Value("${security.jwt.secret:JwtSecretKey}")
	private String secret;
	

}
