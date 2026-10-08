package com.example.demo.controller;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.response.CadastroResponse;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.security.UsuarioSessao;
import com.example.demo.security.jwt.JwtService;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        UsuarioAutenticado usuario = authService.autenticar(request);
        String token = jwtService.gerarToken(usuario);

        ResponseCookie cookie = ResponseCookie.from(JwtService.COOKIE_TOKEN, token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(jwtService.getExpiracao())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(LoginResponse.de(usuario));
    }

    @PostMapping("/register")
    public ResponseEntity<CadastroResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.cadastrar(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UsuarioSessao usuario) {
        authService.logout(usuario);
        ResponseCookie apagar = ResponseCookie.from(JwtService.COOKIE_TOKEN, "")
              .httpOnly(true)
              .secure(true)
              .sameSite("Strict")
              .path("/")
              .maxAge(0)
              .build();

        return ResponseEntity.noContent()
              .header(HttpHeaders.SET_COOKIE, apagar.toString())
              .build();
    }

    @GetMapping("/eu")
    public String eu(Authentication auth) {
      return auth.getName() + " " + auth.getAuthorities();
    }
}
