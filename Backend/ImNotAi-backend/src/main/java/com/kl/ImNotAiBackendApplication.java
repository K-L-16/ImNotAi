package com.kl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class ImNotAiBackendApplication {
    public static void main(String[] args) {
        org.springframework.boot.SpringApplication.run(ImNotAiBackendApplication.class, args);
    }
}
