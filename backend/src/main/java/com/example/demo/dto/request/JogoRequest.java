package com.example.demo.dto.request;

import com.example.demo.entity.PlataformaJogo;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record JogoRequest(
    @NotBlank @Size(max = 150) String titulo,
    @Size(max = 60) String genero,
    @NotEmpty Set<PlataformaJogo> plataformas,
    @Size(max = 100) String desenvolvedora,
    @Min(1950) @Max(2100) Integer anoLancamento
) {
}
