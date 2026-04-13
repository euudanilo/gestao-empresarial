package com.danilo.gestao_empresarial.domain.repository;

import com.danilo.gestao_empresarial.domain.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByCnpj(String cnpj);
    boolean existsByCnpj(String cnpj);
    List<Empresa> findByNomeEmpresaIgnoreCaseContaining(String nomeEmpresa);
}