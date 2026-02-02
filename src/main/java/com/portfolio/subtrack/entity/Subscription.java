package com.portfolio.subtrack.entity;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data // Lombok para generar getters y setters
@Table(name = "subscriptions") // Nombre de la tabla en la BD
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincremental
    private Long id;

    @NotBlank(message = "El nombre del servicio es obligatorio") // validacion
    private String serviceName;

    @Positive(message = "El precio debe ser mayor que cero") // validacion
    private double price;

    @FutureOrPresent(message = "La fecha del próximo cobro debe ser en el futuro o presente") // validacion
    @Column(name = "billing_date")
    private LocalDate billingDate; // Fecha del próximo cobro

    private String currency;
    private String frequency;
    private String category; // Categoría: Streaming, Música, Software, etc.
}