package com.example.demo.security.jwt;

import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.security.UsuarioAutenticadoDetailsService;
import com.example.demo.security.UsuarioSessao;
import com.example.demo.security.jwt.revogar.TokenRevogadoRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenRevogadoRepository tokenRevogadoRepository;

    public JwtFilter(JwtService jwtService, TokenRevogadoRepository tokenRevogadoRepository) {
        this.jwtService = jwtService;
        this.tokenRevogadoRepository = tokenRevogadoRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Cookie cookie = WebUtils.getCookie(request, JwtService.COOKIE_TOKEN);
        if (cookie != null) {
            String token = cookie.getValue();
            jwtService.validar(token).ifPresent(this::autenticar);
        }
        filterChain.doFilter(request, response);
    }

    private void autenticar(TokenValido token){
        UsuarioSessao usuario = new UsuarioSessao(token.usuarioId(),token.jti(), token.expiraEm());
        List<GrantedAuthority> authorities = token.roles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        if(!tokenRevogadoRepository.existsById(token.jti())){
            UsernamePasswordAuthenticationToken auth = UsernamePasswordAuthenticationToken.authenticated(usuario, null, authorities);
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
        }

    }
}
