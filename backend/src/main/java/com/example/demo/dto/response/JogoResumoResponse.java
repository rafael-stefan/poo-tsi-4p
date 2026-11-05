package com.example.demo.dto.response;

import com.example.demo.entity.JogoEntity;

public record JogoResumoResponse(
    Integer id,
    String titulo,
    String capa
) {
    public static JogoResumoResponse de(JogoEntity jogo) {
        return new JogoResumoResponse(jogo.getJogoId(), jogo.getTitulo(), jogo.getCapa());
    }
}
