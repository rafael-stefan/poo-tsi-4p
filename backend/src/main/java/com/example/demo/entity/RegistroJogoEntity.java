package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @CreationTimestamp
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    public boolean pertenceAo(Integer idUsuario) {
        return usuario.getUsuarioId().equals(idUsuario);
    }

    public boolean podeSerAvaliado() {
        return status.getPermiteAvaliacao();
    }
}
