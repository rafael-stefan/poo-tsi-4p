package com.example.demo.dto.request;

import com.example.demo.entity.StatusJogo;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record RegistroJogoRequest(
    @NotNull Integer jogoId,
    @NotNull StatusJogo status,
    @PastOrPresent LocalDate dataInicio,
    @PastOrPresent LocalDate dataConclusao,
    @Positive Integer horasJogo
) {
}
