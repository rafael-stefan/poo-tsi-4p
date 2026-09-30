package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "registros_jogo")
@Getter
@Setter
public class RegistroJogoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer registroJogoId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jogo_id", nullable = false)
    private JogoEntity jogo;

    @Column(name = "horas_jogo")
    private Integer horasJogo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusJogo status;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;
}
