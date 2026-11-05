package com.example.demo.repository;

import com.example.demo.entity.AvaliacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<AvaliacaoEntity, Integer> {

    boolean existsByRegistroJogo_RegistroJogoId(Integer registroId);

    Optional<AvaliacaoEntity> findByRegistroJogo_RegistroJogoId(Integer registroId);

    Optional<AvaliacaoEntity> findByAvaliacaoIdAndRegistroJogo_Usuario_UsuarioId(Integer avaliacaoId, Integer usuarioId);

    List<AvaliacaoEntity> findByRegistroJogo_Jogo_JogoIdOrderByDataAvaliacaoDesc(Integer jogoId);

    List<AvaliacaoEntity> findByRegistroJogo_Usuario_UsuarioIdOrderByDataAvaliacaoDesc(Integer usuarioId);

    @Query("select coalesce(avg(a.nota), 0) from AvaliacaoEntity a where a.registroJogo.jogo.jogoId = :jogoId")
    Double mediaPorJogo(@Param("jogoId") Integer jogoId);

    long countByRegistroJogo_Jogo_JogoId(Integer jogoId);

    @Query("select coalesce(avg(a.nota), 0) from AvaliacaoEntity a where a.registroJogo.usuario.usuarioId = :id")
    double mediaPorUsuario(@Param("id") Integer id);
}
