package com.example.demo.security;

import java.security.Principal;
import java.time.Instant;

public record UsuarioSessao(Integer usuarioId, String jti, Instant expiraEm) implements Principal {
    @Override
    public String getName(){
        return usuarioId.toString();
    }
}
