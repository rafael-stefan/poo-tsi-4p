package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PromoverAdminRequest(
        @NotBlank @Size(max = 30) String matriculaAdmin
) {
}
