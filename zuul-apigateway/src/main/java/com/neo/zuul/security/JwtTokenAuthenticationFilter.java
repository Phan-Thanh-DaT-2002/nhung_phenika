package com.neo.zuul.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.neo.common.config.JwtConfig;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;

/**
 * @author NEO Team
 * @Email: @neo.vn
 * @Version 1.0.0
 */
@Slf4j
public class JwtTokenAuthenticationFilter extends OncePerRequestFilter {

	private final JwtConfig jwtConfig;

	public JwtTokenAuthenticationFilter(JwtConfig jwtConfig) {
		this.jwtConfig = jwtConfig;
	}

	@Override
	@SuppressWarnings("unchecked")
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		// 1. get the authentication header. Tokens are supposed to be passed in the
		// authentication header
		String header = request.getHeader(jwtConfig.getHeader());

		// 2. validate the header and check the prefix
		if (header == null || !header.startsWith(jwtConfig.getPrefix())) {
			chain.doFilter(request, response); // If not valid, go to the next filter.
			return;
		}

		// 3. Get the token
		String token = header.replace(jwtConfig.getPrefix(), "");

		try {
			// 4. Validate the token (check token is expired,..)
			Claims claims = Jwts.parser().setSigningKey(jwtConfig.getSecret().getBytes()).parseClaimsJws(token)
					.getBody();

			String username = claims.getSubject();
			if (username != null) {
				List<String> authorities = (List<String>) claims.get("authorities");
				if (authorities == null || authorities.isEmpty()) {
			          authorities = (List<String>) claims.get("roles");
			        }
			        if (authorities != null) {
			          log.info("authorities list: " + authorities.toString());
			        } else {
			          authorities = new ArrayList<String>();
			        }

				// 5. Create auth object
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
						authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));

				// 6. Authenticate the user
				SecurityContextHolder.getContext().setAuthentication(auth);
			}

		} catch (Exception e) {
			// In case of failure. Make sure it's clear; so guarantee user won't be
			// authenticated
			SecurityContextHolder.clearContext();
		}

		// go to the next filter in the filter chain
		chain.doFilter(request, response);
	}

}