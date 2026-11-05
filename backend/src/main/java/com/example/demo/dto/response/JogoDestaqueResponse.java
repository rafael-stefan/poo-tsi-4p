package com.example.demo.dto.response;

public record JogoDestaqueResponse(
    JogoResumoResponse jogo,
    String genero,
    Double notaMedia,
    long totalAvaliacoes,
    long pessoas
) {
}
