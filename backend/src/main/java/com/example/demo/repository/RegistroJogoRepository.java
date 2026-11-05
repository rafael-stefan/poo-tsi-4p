package com.example.demo.repository;

import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.entity.StatusJogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroJogoRepository extends JpaRepository<RegistroJogoEntity, Integer> {
    boolean existsByJogo_JogoId(Integer jogoId);

    Optional<RegistroJogoEntity> findByRegistroJogoIdAndUsuario_UsuarioId(Integer registroId, Integer usuarioId);

    List<RegistroJogoEntity> findByUsuario_UsuarioIdOrderByDataInicioDesc(Integer usuarioId);

    List<RegistroJogoEntity> findByUsuario_UsuarioIdAndStatusOrderByDataInicioDesc(Integer usuarioId, StatusJogo status);

    boolean existsByUsuario_UsuarioIdAndJogo_JogoIdAndStatusInAndRegistroJogoIdNot(Integer usuarioId, Integer jogoId, Collection<StatusJogo> status, Integer registroIdIgnorado);

    boolean existsByUsuario_UsuarioIdAndJogo_JogoIdAndStatusAndRegistroJogoIdNot(Integer usuarioId, Integer jogoId, StatusJogo status, Integer registroIdIgnorado);
}
