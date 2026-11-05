package com.example.demo.model;

public record Estatisticas(
    long jogosZerados,
    long jogosEmAndamento,
    long jogosDesistidos,
    long totalRuns,
    double mediaAvaliacoes,
    long horasTotais
) {
}
