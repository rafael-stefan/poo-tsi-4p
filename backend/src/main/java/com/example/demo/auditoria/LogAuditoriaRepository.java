package com.example.demo.auditoria;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoriaEntity, Integer> {

    @Query("""
            select new com.example.demo.auditoria.LogAuditoriaResponse(
                l.id, l.dataHora, l.usuarioId, u.nome, l.ip, l.metodo, l.rota, l.status)
            from LogAuditoriaEntity l
            left join UsuarioEntity u on u.usuarioId = l.usuarioId
            order by l.dataHora desc, l.id desc
            """)
    List<LogAuditoriaResponse> listarRecentes(Pageable pagina);
}
