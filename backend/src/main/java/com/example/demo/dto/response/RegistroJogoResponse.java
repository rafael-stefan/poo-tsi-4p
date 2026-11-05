package com.example.demo.dto.response;

import com.example.demo.entity.AvaliacaoEntity;
import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.entity.StatusJogo;

import java.time.LocalDate;

public record RegistroJogoResponse(
    Integer id,
    Integer jogoId,
    String tituloJogo,
    StatusJogo status,
    LocalDate dataInicio,
    LocalDate dataConclusao,
    Integer horasJogo,
    Integer avaliacaoId,
    String capaJogo,
    Double nota
) {
    public static RegistroJogoResponse de(RegistroJogoEntity registro, AvaliacaoEntity avaliacao) {
        Integer avaliacaoId = null;
        Double nota = null;
        if (avaliacao != null) {
            avaliacaoId = avaliacao.getAvaliacaoId();
            nota = avaliacao.getNota();
        }
        return new RegistroJogoResponse(
            registro.getRegistroJogoId(),
            registro.getJogo().getJogoId(),
            registro.getJogo().getTitulo(),
            registro.getStatus(),
            registro.getDataInicio(),
            registro.getDataConclusao(),
            registro.getHorasJogo(),
            avaliacaoId,
            registro.getJogo().getCapa(),
            nota
        );
    }
}
