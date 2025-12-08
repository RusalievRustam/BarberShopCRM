package com.example.BarbershopSRMSystem.entities;

import com.example.BarbershopSRMSystem.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "barbers")
public class Barber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String phone;

    private LocalDate hireDate;

    @Column(nullable = false)
    @PrePersist
    protected void onCreate() {
        hireDate = LocalDate.now();
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

}
