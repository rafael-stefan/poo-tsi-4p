package com.example.demo.dto.response;

import com.example.demo.entity.JogoEntity;
import com.example.demo.entity.PlataformaJogo;

import java.util.EnumSet;
import java.util.Set;

public record JogoResponse(
    Integer id,
    String titulo,
    String genero,
    Set<PlataformaJogo> plataformas,
    String desenvolvedora,
    Integer anoLancamento
) {
    public static JogoResponse de(JogoEntity jogo) {
        Set<PlataformaJogo> plataformas = EnumSet.noneOf(PlataformaJogo.class);
        plataformas.addAll(jogo.getPlataformas());
        return new JogoResponse(jogo.getJogoId(), jogo.getTitulo(), jogo.getGenero(), plataformas, jogo.getDesenvolvedora(), jogo.getAnoLancamento());
    }
}
