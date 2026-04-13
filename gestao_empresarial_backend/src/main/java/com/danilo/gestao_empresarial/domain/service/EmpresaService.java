package com.danilo.gestao_empresarial.domain.service;

import com.danilo.gestao_empresarial.dto.EmpresaCreateRequest;
import com.danilo.gestao_empresarial.dto.EmpresaResponse;
import com.danilo.gestao_empresarial.dto.EmpresaUpdateRequest;
import com.danilo.gestao_empresarial.domain.entity.Empresa;
import com.danilo.gestao_empresarial.domain.repository.EmpresaRepository;
import com.danilo.gestao_empresarial.integration.brasilapi.BrasilApiClient;
import com.danilo.gestao_empresarial.shared.exception.BusinessException;
import com.danilo.gestao_empresarial.shared.exception.ConflictException;
import com.danilo.gestao_empresarial.shared.exception.NotFoundException;
import com.danilo.gestao_empresarial.shared.util.Normalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository repository;
    private final BrasilApiClient brasilApi;

    @Transactional
    public EmpresaResponse criar(EmpresaCreateRequest req) {
        String cnpj = Normalizer.onlyDigits(req.getCnpj());
        String cep  = Normalizer.onlyDigits(req.getCep());

        if (repository.existsByCnpj(cnpj)) {
            throw new BusinessException("ja existe está empresa cadastrada");
        }

        validarCnpjExiste(cnpj);

        Empresa empresa = Empresa.builder()
                .nomeEmpresa(req.getNomeEmpresa().trim())
                .cnpj(cnpj)
                .cep(cep)
                .numero(req.getNumero().trim())
                .complemento(req.getComplemento())
                .nomeContato(req.getNomeContato().trim())
                .telefone(req.getTelefone())
                .celular(req.getCelular())
                .email(req.getEmail().trim())
                .build();

        preencherEnderecoPorCep(empresa, cep);

        Empresa salvo = repository.save(empresa);
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<EmpresaResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EmpresaResponse buscarPorCnpj(String cnpj) {
        Empresa empresa = buscarPorCnpjOuNomeEntity(cnpj, null);
        return toResponse(empresa);
    }

    @Transactional(readOnly = true)
    public EmpresaResponse buscarPorCnpjOuNome(String cnpj, String nome) {
        Empresa empresa = buscarPorCnpjOuNomeEntity(cnpj, nome);
        return toResponse(empresa);
    }

    @Transactional
    public EmpresaResponse atualizar(String cnpj, EmpresaUpdateRequest req) {
        Empresa empresa = buscarPorCnpjOuNomeEntity(cnpj, null);

        String cep = Normalizer.onlyDigits(req.getCep());

        empresa.setNomeEmpresa(req.getNomeEmpresa().trim());
        empresa.setCep(cep);
        empresa.setNumero(req.getNumero().trim());
        empresa.setComplemento(req.getComplemento());
        empresa.setNomeContato(req.getNomeContato().trim());
        empresa.setTelefone(req.getTelefone());
        empresa.setCelular(req.getCelular());
        empresa.setEmail(req.getEmail().trim());

        preencherEnderecoPorCep(empresa, cep);

        Empresa salvo = repository.save(empresa);
        return toResponse(salvo);
    }

    @Transactional
    public void deletar(String cnpj) {
        Empresa empresa = buscarPorCnpjOuNomeEntity(cnpj, null);
        repository.delete(empresa);
    }

    private Empresa buscarPorCnpjOuNomeEntity(String cnpj, String nome) {
        if (cnpj != null && !cnpj.isBlank()) {
            String cnpjNorm = Normalizer.onlyDigits(cnpj);
            return repository.findByCnpj(cnpjNorm)
                    .orElseThrow(() -> new NotFoundException("Empresa não encontrada para o CNPJ informado"));
        }

        if (nome != null && !nome.isBlank()) {
            List<Empresa> lista = repository.findByNomeEmpresaIgnoreCaseContaining(nome.trim());
            if (lista.isEmpty()) {
                throw new NotFoundException("Empresa não encontrada para o nome informado");
            }
            if (lista.size() > 1) {
                throw new ConflictException("Mais de uma empresa encontrada para o nome informado. Use CNPJ.");
            }
            return lista.get(0);
        }

        throw new BusinessException("Informe CNPJ ou Nome da Empresa");
    }

    private void validarCnpjExiste(String cnpj14) {
        var resp = brasilApi.consultarCnpj(cnpj14);
        if (resp == null) {
            throw new BusinessException("este cnpj não existe");
        }
    }

    private void preencherEnderecoPorCep(Empresa empresa, String cep8) {
        var resp = brasilApi.consultarCep(cep8);
        if (resp == null) {
            throw new BusinessException("CEP não encontrado");
        }
        empresa.setEndereco(resp.getStreet());
        empresa.setBairro(resp.getNeighborhood());
        empresa.setCidade(resp.getCity());
        empresa.setEstado(resp.getState());
    }

    private EmpresaResponse toResponse(Empresa e) {
        return EmpresaResponse.builder()
                .nomeEmpresa(e.getNomeEmpresa())
                .cnpj(e.getCnpj())
                .cep(e.getCep())
                .endereco(e.getEndereco())
                .numero(e.getNumero())
                .bairro(e.getBairro())
                .cidade(e.getCidade())
                .estado(e.getEstado())
                .complemento(e.getComplemento())
                .nomeContato(e.getNomeContato())
                .telefone(e.getTelefone())
                .celular(e.getCelular())
                .email(e.getEmail())
                .build();
    }
}