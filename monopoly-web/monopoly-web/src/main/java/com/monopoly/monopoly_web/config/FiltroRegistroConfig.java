/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.config;

/**
 *
 * @author gabri
 */
import jakarta.servlet.Filter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FiltroRegistroConfig {

    @Bean
    public FilterRegistrationBean<Filter> corsFiltroRegistration(CorsFiltro corsFiltro) {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(corsFiltro);
        registrationBean.addUrlPatterns("/*"); // aplicar a todo
        registrationBean.setOrder(0); // más prioritario
        return registrationBean;
    }
}
