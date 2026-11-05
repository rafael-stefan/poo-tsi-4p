package com.example.demo.dto.response;

import com.example.demo.entity.AmizadeEntity;
import com.example.demo.entity.StatusAmizade;

import java.time.LocalDateTime;

public record AmizadeResponse(
    Integer id,
    UsuarioResumoResponse solicitante,
    UsuarioResumoResponse destinatario,
    StatusAmizade status,
    LocalDateTime data
) {
    public static AmizadeResponse de(AmizadeEntity amizade) {
        return new AmizadeResponse(
            amizade.getAmizadeId(),
            UsuarioResumoResponse.de(amizade.getSolicitante()),
            UsuarioResumoResponse.de(amizade.getDestinatario()),
            amizade.getStatus(),
            amizade.getDataAmizade());
    }
}
