package com.example.demo.controller;

import com.example.demo.dto.request.PromoverAdminRequest;
import com.example.demo.dto.response.UsuarioAdminResponse;
import com.example.demo.security.IdSolicitante;
import com.example.demo.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/usuarios")
    public List<UsuarioAdminResponse> listarUsuarios() {
        return adminService.listarUsuarios();
    }

    @PatchMapping("/usuarios/{id}/suspender")
    public UsuarioAdminResponse suspender(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        return adminService.suspender(idSolicitante, id);
    }

    @PatchMapping("/usuarios/{id}/reativar")
    public UsuarioAdminResponse reativar(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        return adminService.reativar(idSolicitante, id);
    }

    @PostMapping("/usuarios/{id}/promover")
    public ResponseEntity<Void> promover(@IdSolicitante Integer idSolicitante, @PathVariable Integer id,
                                         @Valid @RequestBody PromoverAdminRequest request) {
        adminService.promover(idSolicitante, id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/avaliacoes/{id}")
    public ResponseEntity<Void> excluirAvaliacao(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        adminService.excluirAvaliacao(idSolicitante, id);
        return ResponseEntity.noContent().build();
    }
}
