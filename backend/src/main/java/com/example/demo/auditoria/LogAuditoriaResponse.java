package com.example.demo.auditoria;

import java.time.LocalDateTime;

public record LogAuditoriaResponse(
        Integer id,
        LocalDateTime dataHora,
        Integer usuarioId,
        String nomeUsuario,
        String ip,
        String metodo,
        String rota,
        int status
) {}
