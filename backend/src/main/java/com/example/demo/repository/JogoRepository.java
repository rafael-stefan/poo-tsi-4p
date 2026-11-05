package com.example.demo.repository;

import com.example.demo.entity.JogoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JogoRepository extends JpaRepository<JogoEntity, Integer> {
    List<JogoEntity> findByTituloContainingIgnoreCaseOrderByTituloAsc(String titulo);
    List<JogoEntity> findByGeneroIgnoreCaseOrderByTituloAsc(String genero);
    List<JogoEntity> findAllByOrderByTituloAsc();
    boolean existsByTituloIgnoreCase(String titulo);
    boolean existsByTituloIgnoreCaseAndJogoIdNot(String titulo, Integer jogoId);
}
