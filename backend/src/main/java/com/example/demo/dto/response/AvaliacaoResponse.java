package com.example.demo.dto.response;

import com.example.demo.entity.AvaliacaoEntity;
import com.example.demo.entity.RegistroJogoEntity;

import java.time.LocalDateTime;

public record AvaliacaoResponse(
    Integer id,
    Integer registroId,
    Integer jogoId,
    String tituloJogo,
    Integer autorId,
    String autorNome,
    Double nota,
    String comentario,
    Integer horasJogo,
    LocalDateTime dataAvaliacao
) {
    public static AvaliacaoResponse de(AvaliacaoEntity avaliacao) {
        RegistroJogoEntity registro = avaliacao.getRegistroJogo();
        return new AvaliacaoResponse(
            avaliacao.getAvaliacaoId(),
            registro.getRegistroJogoId(),
            registro.getJogo().getJogoId(),
            registro.getJogo().getTitulo(),
            registro.getUsuario().getUsuarioId(),
            registro.getUsuario().getNome(),
            avaliacao.getNota(),
            avaliacao.getComentario(),
            registro.getHorasJogo(),
            avaliacao.getDataAvaliacao()
        );
    }
}
