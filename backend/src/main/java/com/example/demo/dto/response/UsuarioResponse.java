package com.example.demo.dto.response;

import com.example.demo.entity.UsuarioEntity;

public record UsuarioResponse(
    Integer id,
    String nome,
    String email,
    String fotoPerfil
) {
    public static UsuarioResponse de(UsuarioEntity usuario) {
        return new UsuarioResponse(usuario.getUsuarioId(), usuario.getNome(), usuario.getEmail(), usuario.getFotoPerfil());
    }
}
