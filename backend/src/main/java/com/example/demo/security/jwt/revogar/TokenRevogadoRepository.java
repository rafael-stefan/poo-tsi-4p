package com.example.demo.security.jwt.revogar;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface TokenRevogadoRepository extends JpaRepository<TokenRevogadoEntity, String> {
    @Modifying
    @Transactional
    @Query("delete from TokenRevogadoEntity t where t.expiraEm < :agora")
    int apagarExpirados(Instant agora);


}
