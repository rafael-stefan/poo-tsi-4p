package com.example.demo.security;

import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.UsuarioService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioAutenticadoDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioAutenticadoDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
      return usuarioRepository.findByEmail(email.trim().toLowerCase())
          .map(UsuarioAutenticado::de)
          .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
  }
}
