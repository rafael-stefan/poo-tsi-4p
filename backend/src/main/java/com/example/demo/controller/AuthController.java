package com.example.demo.controller;

import com.example.demo.dto.request.AlterarSenhaRequest;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.response.CadastroResponse;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.security.UsuarioSessao;
import com.example.demo.security.jwt.JwtService;
import com.example.demo.service.AuthService;
import com.example.demo.auditoria.AuditoriaInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final boolean cookieSecure;

    public AuthController(AuthService authService, JwtService jwtService,
                          @Value("${gamelog.cookie.secure}") boolean cookieSecure) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.cookieSecure = cookieSecure;
    }

    @PostMapping("/register")
    public ResponseEntity<CadastroResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.cadastrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        UsuarioAutenticado usuario = authService.autenticar(request);
        servletRequest.setAttribute(AuditoriaInterceptor.ATRIBUTO_USUARIO, usuario.getUsuarioId());
        String token = jwtService.gerarToken(usuario);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieDoToken(token, jwtService.getExpiracao()).toString())
                .body(LoginResponse.de(usuario));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UsuarioSessao sessao) {
        authService.logout(sessao);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieDoToken("", Duration.ZERO).toString())
                .build();
    }

    @PutMapping("/senha")
    public ResponseEntity<Void> alterarSenha(@AuthenticationPrincipal UsuarioSessao sessao,
                                             @Valid @RequestBody AlterarSenhaRequest request) {
        authService.alterarSenha(sessao, request);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieDoToken("", Duration.ZERO).toString())
                .build();
    }

    private ResponseCookie cookieDoToken(String valor, Duration maxAge) {
        return ResponseCookie.from(JwtService.COOKIE_TOKEN, valor)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}
