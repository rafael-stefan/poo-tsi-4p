package com.example.demo.dto.response;

import com.example.demo.entity.UsuarioEntity;

public record CadastroResponse(
    Integer id,
    String nome,
    String email
) {
    public static CadastroResponse de(UsuarioEntity usuario) {
        return new CadastroResponse(usuario.getUsuarioId(), usuario.getNome(), usuario.getEmail());
    }
}
