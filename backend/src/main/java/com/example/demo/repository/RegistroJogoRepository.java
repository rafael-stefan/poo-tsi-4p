package com.example.demo.repository;

import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.entity.StatusJogo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    List<RegistroJogoEntity> findByUsuario_UsuarioIdAndJogo_JogoIdOrderByDataInicioDesc(Integer usuarioId, Integer jogoId);

    @Query("select r from RegistroJogoEntity r where r.usuario.usuarioId in :ids and r.usuario.ativo = true order by r.atualizadoEm desc nulls last")
    List<RegistroJogoEntity> listarRecentesDosUsuarios(@Param("ids") Collection<Integer> ids, Pageable pageable);

    @Query("select r from RegistroJogoEntity r where r.usuario.ativo = true order by r.atualizadoEm desc nulls last")
    List<RegistroJogoEntity> listarRecentes(Pageable pageable);

    @Query("select r.status, count(distinct r.usuario.usuarioId) from RegistroJogoEntity r where r.jogo.jogoId = :jogoId group by r.status")
    List<Object[]> contarPessoasPorStatus(@Param("jogoId") Integer jogoId);

    @Query("select r.jogo.jogoId, count(distinct r.usuario.usuarioId) from RegistroJogoEntity r where r.status in :status and r.usuario.ativo = true group by r.jogo.jogoId order by count(distinct r.usuario.usuarioId) desc")
    List<Object[]> rankingPorStatus(@Param("status") Collection<StatusJogo> status, Pageable pageable);

    boolean existsByUsuario_UsuarioIdAndJogo_JogoIdAndStatusInAndRegistroJogoIdNot(Integer usuarioId, Integer jogoId, Collection<StatusJogo> status, Integer registroIdIgnorado);

    boolean existsByUsuario_UsuarioIdAndJogo_JogoIdAndStatusAndRegistroJogoIdNot(Integer usuarioId, Integer jogoId, StatusJogo status, Integer registroIdIgnorado);

    @Query("select count(distinct r.jogo.jogoId) from RegistroJogoEntity r where r.usuario.usuarioId = :id and r.status in :status")
    long contarJogosPorStatus(@Param("id") Integer id, @Param("status") Collection<StatusJogo> status);

    long countByUsuario_UsuarioId(Integer usuarioId);

    @Query("select coalesce(sum(r.horasJogo), 0) from RegistroJogoEntity r where r.usuario.usuarioId = :id")
    long somarHoras(@Param("id") Integer id);
}
