package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

    @Positive
    @Column(name = "horas_jogo")
    private Integer horasJogo;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusJogo status = StatusJogo.JOGANDO;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;

    public boolean pertenceAo(Integer idUsuario) {
        return usuario.getUsuarioId().equals(idUsuario);
    }

    public boolean podeSerAvaliado() {
        return status.getPermiteAvaliacao();
    }
}
