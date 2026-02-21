package com.kl.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                 // 所有 REST 路径
                .allowedOriginPatterns("*")        // hackathon 先全放开
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)           // 如果你不用 cookie/session，就 false
                .maxAge(3600);
    }
}