package com.test.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EntityScan("com.darpan.security.model")
@EnableJpaRepositories("com.darpan.security.repository")
@ComponentScan(basePackages = {
        "com.test.demo",
        "com.darpan.security",
        "com.darpan.security.service",
        "com.darpan.security.serviceimpl",
        "com.darpan.security.eventlistener"
})
@EnableMethodSecurity
@EnableScheduling
@ComponentScan(basePackages = {
        "com.darpan.communication",
        "com.darpan.databaseAiAgent"
})
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
    }
}
