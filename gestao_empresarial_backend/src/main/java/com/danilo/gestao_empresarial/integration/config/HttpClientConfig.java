package com.danilo.gestao_empresarial.integration.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class HttpClientConfig {

    @Bean
    RestClient restClient() {
        return RestClient.builder()
                .baseUrl("https://brasilapi.com.br/api")
                .build();
    }
}