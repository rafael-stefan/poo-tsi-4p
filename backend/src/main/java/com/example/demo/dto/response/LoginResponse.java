package com.example.demo.dto.response;

import com.example.demo.security.UsuarioAutenticado;

public record LoginResponse(
    Integer id,
    String nome,
    String email
) {
    public static LoginResponse de(UsuarioAutenticado usuario) {
        return new LoginResponse(usuario.getUsuarioId(), usuario.getNome(), usuario.getUsername());
    }
}
