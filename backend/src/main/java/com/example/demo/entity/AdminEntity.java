package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "admin_users")
@Getter
@Setter
public class AdminEntity extends UsuarioEntity {
    @Column(name = "matricula_admin", nullable = false, unique = true)
    private String matriculaAdmin;

    @Column(name = "data_promocao", nullable = false)
    private LocalDate dataPromocao;
}
