package com.example.demo.dto.request;

import jakarta.validation.constraints.NotNull;

public record AmizadeRequest(
    @NotNull Integer destinatarioId
) {
}
