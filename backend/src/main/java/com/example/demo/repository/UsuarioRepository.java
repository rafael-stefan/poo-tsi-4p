package com.example.demo.repository;

import com.example.demo.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface  UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {
    Optional<UsuarioEntity> findById(Integer integer);
    Optional<UsuarioEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    List<UsuarioEntity> findTop20ByNomeContainingIgnoreCaseAndAtivoTrueOrderByNomeAsc(String nome);
    List<UsuarioEntity> findAllByOrderByNomeAsc();

    @Query(value = "select count(*) > 0 from admin_users where usuario_id = :id", nativeQuery = true)
    boolean ehAdmin(@Param("id") Integer id);

    @Modifying
    @Query(value = "insert into admin_users (usuario_id, matricula_admin, data_promocao) values (:id, :matricula, current_date)", nativeQuery = true)
    void promover(@Param("id") Integer id, @Param("matricula") String matricula);
}
