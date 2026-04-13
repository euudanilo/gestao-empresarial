package com.danilo.gestao_empresarial.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaCreateRequest {

    @NotBlank(message="Nome da empresa é obrigatório")
    private String nomeEmpresa;

    @NotBlank(message="CNPJ é obrigatório")
    @Pattern(regexp="\\d{14}", message="CNPJ deve conter 14 dígitos (somente números)")
    private String cnpj;

    @NotBlank(message="CEP é obrigatório")
    @Pattern(regexp="\\d{8}", message="CEP deve conter 8 dígitos (somente números)")
    private String cep;

    @NotBlank(message="Número é obrigatório")
    private String numero;

    private String complemento;

    @NotBlank(message="Nome do contato é obrigatório")
    private String nomeContato;

    private String telefone;
    private String celular;

    @NotBlank(message="Email é obrigatório")
    @Email(message="Email inválido")
    private String email;
}