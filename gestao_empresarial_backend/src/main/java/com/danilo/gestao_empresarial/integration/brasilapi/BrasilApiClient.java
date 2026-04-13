package com.danilo.gestao_empresarial.integration.brasilapi;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class BrasilApiClient {

    private final RestClient restClient;

    public BrasilApiClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public CepResponse consultarCep(String cep) {
        try {
            return restClient.get()
                    .uri("/cep/v2/{cep}", cep)
                    .retrieve()
                    .body(CepResponse.class);
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return null;
            throw ex;
        }
    }

    public CnpjResponse consultarCnpj(String cnpj) {
        try {
            return restClient.get()
                    .uri("/cnpj/v1/{cnpj}", cnpj)
                    .retrieve()
                    .body(CnpjResponse.class);
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return null;
            throw ex;
        }
    }
}