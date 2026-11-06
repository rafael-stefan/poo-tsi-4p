package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EditarPerfilRequest(
        @NotBlank(message = "Informe o nome")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @Size(max = 255, message = "A URL da foto deve ter no máximo 255 caracteres")
        @Pattern(regexp = "^(https?://\\S+)?$", message = "A foto deve ser uma URL começando com http:// ou https://")
        String fotoPerfil
) {}
