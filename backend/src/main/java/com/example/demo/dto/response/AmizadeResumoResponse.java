package com.example.demo.dto.response;

import com.example.demo.entity.AmizadeEntity;

import java.time.LocalDateTime;

public record AmizadeResumoResponse(
    Integer id,
    LocalDateTime desde
) {
    public static AmizadeResumoResponse de(AmizadeEntity amizade) {
        return new AmizadeResumoResponse(amizade.getAmizadeId(), amizade.getDataAmizade());
    }
}
