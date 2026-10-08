package com.example.demo.security.jwt;

import com.example.demo.security.UsuarioAutenticado;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JwtService {

    public static final String COOKIE_TOKEN = "gamelog_token";
    private static final String CLAIM_ROLES = "roles";

    private final SecretKey chave;
    private final Duration expiracao;

    public JwtService(@Value("${gamelog.jwt.segredo}") String segredo,
                      @Value("${gamelog.jwt.expiracao}") Duration expiracao) {
        this.chave = Keys.hmacShaKeyFor(Decoders.BASE64.decode(segredo));
        this.expiracao = expiracao;
    }

    public String gerarToken(UsuarioAutenticado usuario) {
        Instant agora = Instant.now();
        List<String> roles = usuario.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return Jwts.builder()
                .subject(usuario.getUsuarioId().toString())
                .id(UUID.randomUUID().toString())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plus(expiracao)))
                .claim(CLAIM_ROLES, roles)
                .signWith(chave)
                .compact();
    }

    public Optional<TokenValido> validar(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(chave)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.of(new TokenValido(
                    Integer.valueOf(claims.getSubject()),
                    claims.getId(),
                    claims.getExpiration().toInstant(),
                    lerRoles(claims)));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Duration getExpiracao() {
        return expiracao;
    }

    private static List<String> lerRoles(Claims claims) {
        List<?> roles = claims.get(CLAIM_ROLES, List.class);
        if (roles == null) {
            return List.of();
        }
        return roles.stream().map(Object::toString).toList();
    }
}
