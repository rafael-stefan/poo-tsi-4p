package com.example.demo.dto.response;

import java.util.List;

public record DestaquesResponse(
    JogoDestaqueResponse manchete,
    JogoDestaqueResponse maisZerado,
    JogoDestaqueResponse maisJogado,
    JogoDestaqueResponse maisRejogado,
    JogoDestaqueResponse maisDesistido,
    List<JogoDestaqueResponse> maisBemAvaliados
) {
}
