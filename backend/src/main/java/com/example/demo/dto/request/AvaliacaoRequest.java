package com.example.demo.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AvaliacaoRequest(
    @NotNull(message = "A nota é obrigatória")
    @DecimalMin(value = "0.0", message = "A nota deve ser maior ou igual a zero")
    @DecimalMax(value = "10.0", message = "A nota deve ser menor ou igual a dez")
    @Digits(integer = 2, fraction = 1, message = "A nota deve ter no máximo uma casa decimal")
    Double nota,

    @Size(max = 500, message = "O comentário deve ter no máximo 500 caracteres")
    String comentario
) {
}
