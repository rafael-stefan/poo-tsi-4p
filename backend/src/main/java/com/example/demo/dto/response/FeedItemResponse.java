package com.example.demo.dto.response;

import com.example.demo.entity.AvaliacaoEntity;
import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.entity.StatusJogo;

import java.time.LocalDateTime;

public record FeedItemResponse(
    String tipo,
    UsuarioResumoResponse usuario,
    JogoResumoResponse jogo,
    StatusJogo status,
    Integer horasJogo,
    Double nota,
    String comentario,
    LocalDateTime quando
) {
    public static FeedItemResponse deRun(RegistroJogoEntity registro) {
        LocalDateTime quando = registro.getAtualizadoEm();
        if (quando == null) {
            quando = registro.getCriadoEm();
        }
        return new FeedItemResponse(
            "RUN",
            UsuarioResumoResponse.de(registro.getUsuario()),
            JogoResumoResponse.de(registro.getJogo()),
            registro.getStatus(),
            registro.getHorasJogo(),
            null,
            null,
            quando
        );
    }

    public static FeedItemResponse deAvaliacao(AvaliacaoEntity avaliacao) {
        RegistroJogoEntity registro = avaliacao.getRegistroJogo();
        return new FeedItemResponse(
            "AVALIACAO",
            UsuarioResumoResponse.de(registro.getUsuario()),
            JogoResumoResponse.de(registro.getJogo()),
            registro.getStatus(),
            registro.getHorasJogo(),
            avaliacao.getNota(),
            avaliacao.getComentario(),
            avaliacao.getDataAvaliacao()
        );
    }
}
