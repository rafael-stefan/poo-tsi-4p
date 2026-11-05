package com.example.demo.dto.response;

import com.example.demo.entity.UsuarioEntity;

public record UsuarioResumoResponse(
    Integer id,
    String nome,
    String fotoPerfil
) {
    public static UsuarioResumoResponse de(UsuarioEntity usuario) {
        return new UsuarioResumoResponse(usuario.getUsuarioId(), usuario.getNome(), usuario.getFotoPerfil());
    }
}
