package com.example.demo.dto.response;

import com.example.demo.entity.StatusJogo;

import java.util.List;
import java.util.Map;

public record EstatisticasJogoResponse(
    Map<StatusJogo, Long> pessoasPorStatus,
    List<FaixaNotaResponse> distribuicaoNotas
) {
}
