package com.example.demo.auditoria;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "log_auditoria")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class LogAuditoriaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreationTimestamp
    @Column(name = "data_hora", nullable = false, updatable = false)
    private LocalDateTime dataHora;

    @Column(name = "usuario_id")
    private Integer usuarioId;

    @Column(name = "ip", length = 64)
    private String ip;

    @Column(name = "metodo", nullable = false, length = 10)
    private String metodo;

    @Column(name = "rota", nullable = false)
    private String rota;

    @Column(name = "status", nullable = false)
    private int status;

    public LogAuditoriaEntity(Integer usuarioId, String ip, String metodo, String rota, int status) {
        this.usuarioId = usuarioId;
        this.ip = ip;
        this.metodo = metodo;
        this.rota = rota;
        this.status = status;
    }
}
