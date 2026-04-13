package com.danilo.gestao_empresarial.integration.brasilapi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CnpjResponse {
    private String cnpj;
    private String razao_social;
    private String nome_fantasia;
    private String cep;
    private String logradouro;
    private String bairro;
    private String municipio;
    private String uf;
    private String numero;
    private String complemento;
}