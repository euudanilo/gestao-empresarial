package com.danilo.gestao_empresarial.controller;

import com.danilo.gestao_empresarial.domain.service.EmpresaService;
import com.danilo.gestao_empresarial.dto.EmpresaCreateRequest;
import com.danilo.gestao_empresarial.dto.EmpresaResponse;
import com.danilo.gestao_empresarial.dto.EmpresaUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService service;

    @PostMapping
    public ResponseEntity<EmpresaResponse> criar(@Valid @RequestBody EmpresaCreateRequest request) {
        EmpresaResponse response = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{cnpj}")
    public ResponseEntity<EmpresaResponse> buscarPorCnpj(@PathVariable String cnpj) {
        return ResponseEntity.ok(service.buscarPorCnpj(cnpj));
    }

    @PutMapping("/{cnpj}")
    public ResponseEntity<EmpresaResponse> atualizar(@PathVariable String cnpj,
                                                     @Valid @RequestBody EmpresaUpdateRequest request) {
        return ResponseEntity.ok(service.atualizar(cnpj, request));
    }

    @DeleteMapping("/{cnpj}")
    public ResponseEntity<Void> deletar(@PathVariable String cnpj) {
        service.deletar(cnpj);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verificar")
    public ResponseEntity<EmpresaResponse> verificar(@RequestParam(required = false) String cnpj,
                                                     @RequestParam(required = false) String nome) {
        return ResponseEntity.ok(service.buscarPorCnpjOuNome(cnpj, nome));
    }
}