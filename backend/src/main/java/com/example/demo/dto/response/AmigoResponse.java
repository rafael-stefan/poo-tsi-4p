package com.example.demo.dto.response;

import com.example.demo.entity.AmizadeEntity;

import java.time.LocalDateTime;

public record AmigoResponse(
    Integer amizadeId,
    UsuarioResumoResponse amigo,
    LocalDateTime desde
) {
    public static AmigoResponse de(AmizadeEntity amizade, Integer idUsuario) {
        return new AmigoResponse(
            amizade.getAmizadeId(),
            UsuarioResumoResponse.de(amizade.obterAmigoDe(idUsuario)),
            amizade.getDataAmizade());
    }
}
