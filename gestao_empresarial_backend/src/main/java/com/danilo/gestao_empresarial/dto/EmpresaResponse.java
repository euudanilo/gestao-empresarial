package com.danilo.gestao_empresarial.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaResponse {
    private String nomeEmpresa;
    private String cnpj;
    private String cep;
    private String endereco;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String complemento;
    private String nomeContato;
    private String telefone;
    private String celular;
    private String email;
}