package com.neo.core.config;
//package com.mbf.customercare.auth.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//
//@Configuration
//@EnableWebSecurity
//public class WebMvcConfig extends WebSecurityConfigurerAdapter {
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http.authorizeRequests()
//          .antMatchers("/login").permitAll()
//          .antMatchers("/confirm-account/**").permitAll()
//          .anyRequest().authenticated()
//          .and()
//          .formLogin().permitAll()
//          .and()
//          .csrf().disable();
//    }
// 
//
//}
