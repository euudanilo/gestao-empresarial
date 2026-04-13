package com.danilo.gestao_empresarial.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "empresas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="nome_empresa", nullable=false, length=160)
    private String nomeEmpresa;

    @Column(nullable=false, unique=true, length=14)
    private String cnpj;

    @Column(nullable=false, length=8)
    private String cep;

    @Column(nullable=false, length=200)
    private String endereco;

    @Column(nullable=false, length=20)
    private String numero;

    @Column(nullable=false, length=120)
    private String bairro;

    @Column(nullable=false, length=120)
    private String cidade;

    @Column(nullable=false, length=2)
    private String estado;

    @Column(length=120)
    private String complemento;

    @Column(nullable=false, length=120)
    private String nomeContato;

    @Column(length=20)
    private String telefone;

    @Column(length=20)
    private String celular;

    @Column(nullable=false, length=160)
    private String email;
}