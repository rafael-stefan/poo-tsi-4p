package com.example.demo.dto.response;

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
    Integer horasJogo
) {
    public static RegistroJogoResponse de(RegistroJogoEntity registro) {
        return new RegistroJogoResponse(
            registro.getRegistroJogoId(),
            registro.getJogo().getJogoId(),
            registro.getJogo().getTitulo(),
            registro.getStatus(),
            registro.getDataInicio(),
            registro.getDataConclusao(),
            registro.getHorasJogo()
        );
    }
}
