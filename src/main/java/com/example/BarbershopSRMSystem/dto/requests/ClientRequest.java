package com.example.BarbershopSRMSystem.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {
    @NotBlank
    @Size(min = 2, max = 70, message = "Имя должно состоять от 2 до 70 букв")
    private String firstName;

    @Size(min = 2, max = 70, message = "Фамилия должно состоять от 2 до 70 букв")
    private String lastName;
    @Pattern(
            regexp = "^\\+?[0-9]{9,15}$",
            message = "Некорректный номер телефона. Используйте формат: +996777123456"
    )
    private String phoneNumber;
    private String note;
}
