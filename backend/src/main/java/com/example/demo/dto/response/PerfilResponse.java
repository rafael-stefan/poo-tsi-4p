package com.example.demo.dto.response;

import com.example.demo.entity.StatusJogo;
import com.example.demo.model.Estatisticas;

import java.util.List;
import java.util.Map;

public record PerfilResponse(
    UsuarioResumoResponse usuario,
    Estatisticas estatisticas,
    Map<StatusJogo, List<RegistroJogoResponse>> jogosPorStatus,
    List<AvaliacaoResponse> avaliacoes,
    AmizadeResumoResponse amizade
) {
}
