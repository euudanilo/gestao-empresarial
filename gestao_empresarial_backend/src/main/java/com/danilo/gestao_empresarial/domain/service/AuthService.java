package com.danilo.gestao_empresarial.domain.service;

import com.danilo.gestao_empresarial.domain.entity.Usuario;
import com.danilo.gestao_empresarial.domain.repository.UsuarioRepository;
import com.danilo.gestao_empresarial.dto.LoginRequest;
import com.danilo.gestao_empresarial.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService implements ApplicationRunner {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final UsuarioDetailsService usuarioDetailsService;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    public LoginResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        var userDetails = usuarioDetailsService.loadUserByUsername(req.getUsername());
        String token = jwtService.gerarToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .username(userDetails.getUsername())
                .build();
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!repository.existsByUsername(adminUsername)) {
            var admin = Usuario.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Usuario.Role.ADMIN)
                    .build();
            repository.save(admin);
            log.info("Usuário admin criado: {}", adminUsername);
        }
    }
}