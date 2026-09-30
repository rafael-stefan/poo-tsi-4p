package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.EnumSet;
import java.util.Set;

@Entity
@Table(name = "jogos")
@Getter
@Setter
public class JogoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jogoId;

    @NotBlank
    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "genero")
    private String genero;

    @ElementCollection
    @CollectionTable(name = "jogo_plataforma", joinColumns = @JoinColumn(name = "jogo_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "plataforma", nullable = false, length = 20)
    private Set<PlataformaJogo> plataformas = EnumSet.noneOf(PlataformaJogo.class);

    @Column(name = "desenvolvedora")
    private String desenvolvedora;

    @Column(name = "ano_lancamento")
    private Integer anoLancamento;
}
