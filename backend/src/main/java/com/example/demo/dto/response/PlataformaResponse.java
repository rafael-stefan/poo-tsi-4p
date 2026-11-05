package com.example.demo.dto.response;

import com.example.demo.entity.PlataformaJogo;

public record PlataformaResponse(
    String codigo,
    String nome
) {
    public static PlataformaResponse de(PlataformaJogo plataforma) {
        return new PlataformaResponse(plataforma.name(), plataforma.getNome());
    }
}
