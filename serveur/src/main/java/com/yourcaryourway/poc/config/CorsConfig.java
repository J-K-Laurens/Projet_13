package com.yourcaryourway.poc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS -> autoriser Angular (localhost:4200) à communiquer avec le backend (localhost:8080)
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200", "http://localhost:65096")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}