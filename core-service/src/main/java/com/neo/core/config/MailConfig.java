package com.neo.core.config;

import java.nio.charset.StandardCharsets;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@Configuration
public class MailConfig {

	@Bean
	public ResourceBundleMessageSource emailMessageSource() {
		final ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("classpath:/mail/messages");
        messageSource.setDefaultEncoding("UTF-8");
		messageSource.setUseCodeAsDefaultMessage(true);
        return messageSource;
	}
	
	@Bean
	public ITemplateResolver textTemplateResolver() {
		final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
		templateResolver.setOrder(1);
		templateResolver.setResolvablePatterns(Collections.singleton("text/*"));
		templateResolver.setPrefix("/mail/");
		templateResolver.setSuffix(".txt");
		templateResolver.setTemplateMode(TemplateMode.TEXT);
		templateResolver.setCharacterEncoding(StandardCharsets.UTF_8.name());
		templateResolver.setCacheable(false);
		return templateResolver;
	}

	@Bean
	public ITemplateResolver htmlTemplateResolver() {
		final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
		templateResolver.setOrder(2);
		templateResolver.setResolvablePatterns(Collections.singleton("html/*"));
		templateResolver.setPrefix("/mail/");
		templateResolver.setSuffix(".html");
		templateResolver.setTemplateMode(TemplateMode.HTML);
		templateResolver.setCharacterEncoding(StandardCharsets.UTF_8.name());
		templateResolver.setCacheable(false);
		return templateResolver;
	}

}
