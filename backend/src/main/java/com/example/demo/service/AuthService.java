package com.example.demo.service;

import com.example.demo.dto.request.AlterarSenhaRequest;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.response.CadastroResponse;
import com.example.demo.entity.UsuarioEntity;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.security.UsuarioSessao;
import com.example.demo.security.jwt.revogar.TokenRevogadoEntity;
import com.example.demo.security.jwt.revogar.TokenRevogadoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


@Service
public class AuthService {
    private final TokenRevogadoRepository tokenRevogadoRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioService usuarioService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenRevogadoRepository tokenRevogadoRepository) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenRevogadoRepository = tokenRevogadoRepository;
    }

    public CadastroResponse cadastrar(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        boolean exist = usuarioService.existsByEmail(normalizedEmail);
        if (exist) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        UsuarioEntity user = new UsuarioEntity(
                request.nome(),
                normalizedEmail,
                passwordEncoder.encode(request.senha()),
                request.fotoPerfil()
        );

        return CadastroResponse.de(usuarioService.save(user));
    }

    public UsuarioAutenticado autenticar(LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(request.email(), request.senha()));
            return (UsuarioAutenticado) auth.getPrincipal();
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        }
    }

    @Transactional
    public void alterarSenha(UsuarioSessao sessao, AlterarSenhaRequest request) {
        UsuarioEntity usuario = usuarioService.findById(sessao.usuarioId());
        if (!usuario.validarSenha(request.senhaAtual(), passwordEncoder)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual incorreta");
        }
        if (usuario.validarSenha(request.novaSenha(), passwordEncoder)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ser diferente da atual");
        }
        usuario.alterarSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioService.save(usuario);
        logout(sessao);
    }

    public void logout(UsuarioSessao sessao) {
        tokenRevogadoRepository.save(new TokenRevogadoEntity(sessao.jti(), sessao.expiraEm()));
    }
}
