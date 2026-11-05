package com.example.demo.repository;

import com.example.demo.entity.AmizadeEntity;
import com.example.demo.entity.StatusAmizade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AmizadeRepository extends JpaRepository<AmizadeEntity, Integer> {

    @Query("select count(a) > 0 from AmizadeEntity a where ((a.solicitante.usuarioId = :a and a.destinatario.usuarioId = :b) or (a.solicitante.usuarioId = :b and a.destinatario.usuarioId = :a)) and a.status in :status")
    boolean existeVinculo(@Param("a") Integer a, @Param("b") Integer b, @Param("status") Collection<StatusAmizade> status);

    @Query("select a from AmizadeEntity a where (a.solicitante.usuarioId = :idUsuario or a.destinatario.usuarioId = :idUsuario) and a.status = com.example.demo.entity.StatusAmizade.ACEITA order by a.dataAmizade desc")
    List<AmizadeEntity> listarAceitas(@Param("idUsuario") Integer idUsuario);

    @Query("select a from AmizadeEntity a where ((a.solicitante.usuarioId = :a and a.destinatario.usuarioId = :b) or (a.solicitante.usuarioId = :b and a.destinatario.usuarioId = :a)) and a.status = com.example.demo.entity.StatusAmizade.ACEITA")
    Optional<AmizadeEntity> buscarAceitaEntre(@Param("a") Integer a, @Param("b") Integer b);

    List<AmizadeEntity> findByDestinatario_UsuarioIdAndStatusOrderByDataAmizadeDesc(Integer id, StatusAmizade status);

    List<AmizadeEntity> findBySolicitante_UsuarioIdAndStatusOrderByDataAmizadeDesc(Integer id, StatusAmizade status);
}
