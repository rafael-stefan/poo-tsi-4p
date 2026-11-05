package com.example.demo.repository;

import com.example.demo.entity.RegistroJogoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroJogoRepository extends JpaRepository<RegistroJogoEntity, Integer> {
    boolean existsByJogo_JogoId(Integer jogoId);
}
