package com.example.BarbershopSRMSystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "procedure")
public class Procedure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length = 100)
    private String procedureName;

    @Column(length = 100)
    private String description;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false,precision = 10,scale = 2)
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Categories category;

    @Column(nullable = false)
    private Boolean active = true;

}
