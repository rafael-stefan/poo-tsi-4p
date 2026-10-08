package com.example.demo.security;

import com.example.demo.entity.AdminEntity;
import com.example.demo.entity.UsuarioEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class UsuarioAutenticado implements UserDetails {
    private final Integer usuarioId;
    private final String nome;
    private final String email;
    private final String senha;
    private final boolean ativo;
    private final List<GrantedAuthority> authorities;

    private UsuarioAutenticado(Integer usuarioId, String nome, String email, String senha,
                               boolean ativo, List<GrantedAuthority> authorities) {
        this.usuarioId = usuarioId;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.ativo = ativo;
        this.authorities = authorities;
    }

    public static UsuarioAutenticado de(UsuarioEntity usuario) {
        List<GrantedAuthority> papeis = new ArrayList<>();
        papeis.add(new SimpleGrantedAuthority("ROLE_USUARIO"));
        if (usuario instanceof AdminEntity) {
            papeis.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        return new UsuarioAutenticado(
                usuario.getUsuarioId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                usuario.isAtivo(),
                List.copyOf(papeis)
        );
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public String getNome() {
        return nome;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return ativo;
    }
}
