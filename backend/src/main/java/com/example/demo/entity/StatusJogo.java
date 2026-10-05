package com.example.demo.entity;


public enum StatusJogo {
    JOGANDO("Jogando", false, false),
    ZERADO("Zerado", true, true),
    REJOGANDO("Rejogando", true, false),
    DESISTIDO("Desistido", true, false);

    private final String descricao;
    private final Boolean permiteAvaliacao;
    private final Boolean exigeDataConclusao;

    StatusJogo(String descricao, Boolean permiteAvaliacao, Boolean exigeDataConclusao) {
        this.descricao = descricao;
        this.permiteAvaliacao = permiteAvaliacao;
        this.exigeDataConclusao = exigeDataConclusao;
    }

    public String getDescricao() { return descricao; }

    public Boolean getPermiteAvaliacao() { return permiteAvaliacao; }

    public Boolean getExigeDataConclusao() { return exigeDataConclusao; }
}
