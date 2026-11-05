package com.example.demo.dto.response;

import com.example.demo.entity.JogoEntity;
import com.example.demo.entity.PlataformaJogo;

import java.util.EnumSet;
import java.util.Set;

public record JogoResponse(
    Integer id,
    String titulo,
    String capa,
    String genero,
    Set<PlataformaJogo> plataformas,
    String desenvolvedora,
    Integer anoLancamento,
    Double notaMedia,
    long totalAvaliacoes
) {
    public static JogoResponse de(JogoEntity jogo, Double notaMedia, long totalAvaliacoes) {
        Set<PlataformaJogo> plataformas = EnumSet.noneOf(PlataformaJogo.class);
        plataformas.addAll(jogo.getPlataformas());
        return new JogoResponse(jogo.getJogoId(), jogo.getTitulo(), jogo.getCapa(), jogo.getGenero(), plataformas, jogo.getDesenvolvedora(), jogo.getAnoLancamento(), notaMedia, totalAvaliacoes);
    }
}
