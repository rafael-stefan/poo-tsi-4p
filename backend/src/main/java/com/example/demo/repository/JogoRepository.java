package com.example.demo.repository;

import com.example.demo.entity.JogoEntity;
import com.example.demo.entity.PlataformaJogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JogoRepository extends JpaRepository<JogoEntity, Integer> {
    List<JogoEntity> findByTituloContainingIgnoreCaseOrderByTituloAsc(String titulo);
    List<JogoEntity> findByGeneroIgnoreCaseOrderByTituloAsc(String genero);
    List<JogoEntity> findAllByOrderByTituloAsc();
    List<JogoEntity> findTop12ByOrderByJogoIdDesc();

    @Query("select j from JogoEntity j join j.plataformas p where p = :plataforma order by j.titulo")
    List<JogoEntity> buscarPorPlataforma(@Param("plataforma") PlataformaJogo plataforma);

    @Query("select distinct j.genero from JogoEntity j where j.genero is not null and j.genero <> '' order by j.genero")
    List<String> listarGeneros();

    boolean existsByTituloIgnoreCase(String titulo);
    boolean existsByTituloIgnoreCaseAndJogoIdNot(String titulo, Integer jogoId);
}
