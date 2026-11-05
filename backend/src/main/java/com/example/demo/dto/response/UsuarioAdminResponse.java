package com.example.demo.dto.response;

import com.example.demo.entity.AdminEntity;
import com.example.demo.entity.UsuarioEntity;

import java.time.LocalDateTime;

public record UsuarioAdminResponse(
        Integer id,
        String nome,
        String email,
        boolean ativo,
        boolean admin,
        LocalDateTime dataCriacao
) {
    public static UsuarioAdminResponse de(UsuarioEntity usuario) {
        return new UsuarioAdminResponse(
                usuario.getUsuarioId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.isAtivo(),
                usuario instanceof AdminEntity,
                usuario.getDataCriacao());
    }
}
