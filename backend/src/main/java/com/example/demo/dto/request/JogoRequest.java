package com.example.demo.dto.request;

import com.example.demo.entity.PlataformaJogo;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record JogoRequest(
    @NotBlank @Size(max = 150) String titulo,
    @Size(max = 60) String genero,
    @Size(max = 150) @Pattern(regexp = "^[a-z0-9-]+\\.(jpg|jpeg|png|webp)$", message = "Use só o nome do arquivo, em minúsculas, ex.: hollow-knight.jpg") String capa,
    @NotEmpty Set<PlataformaJogo> plataformas,
    @Size(max = 100) String desenvolvedora,
    @Min(1950) @Max(2100) Integer anoLancamento
) {
}
