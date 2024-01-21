package com.neo.core.config;

import org.modelmapper.ModelMapper;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

//import com.neo.core.util.TokenJWTUtils;

/**
 * @author Neo Team
 * @Email: @neo.vn
 * @Version 1.0.0 Dec 29, 2020
 */

@Configuration 
public class InitConfig {
	
	@Bean(initMethod = "init")
	public InitBean initBean() {
    return new InitBean();
	}
	
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean
	@LoadBalanced
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Bean
	public JwtConfig jwtConfig() {
		return new JwtConfig();
	}
	
//	@Bean
//	public TokenJWTUtils tokenJWTUtils() {
//		return new TokenJWTUtils();
//	}
}
