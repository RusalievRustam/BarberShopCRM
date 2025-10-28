package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.ClientResponse;
import com.example.BarbershopSRMSystem.dto.requests.ClientRequest;
import com.example.BarbershopSRMSystem.entities.Client;
import com.example.BarbershopSRMSystem.services.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    // --- Список клиентов ---
    @GetMapping
    public String listClients(Model model) {
        model.addAttribute("clients", clientService.getAllClients());
        return "clients/list"; // src/main/resources/templates/clients/list.html
    }

    // --- Форма создания клиента ---
    @GetMapping("/create")
    public String createClientForm(Model model) {
        model.addAttribute("clientRequest", new ClientRequest());
        return "clients/create"; // src/main/resources/templates/clients/create.html
    }

    // --- Сохранение нового клиента ---
    @PostMapping("/create")
    public String createClient(@Valid @ModelAttribute("clientRequest") ClientRequest request,
                               BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "clients/create";
        }
        clientService.createClient(request);
        return "redirect:/clients";
    }

    // --- Форма редактирования клиента ---
    @GetMapping("/edit/{id}")
    public String editClientForm(@PathVariable Long id, Model model) {
        ClientResponse clientResponse = clientService.getClientById(id);

        ClientRequest request = new ClientRequest();
        request.setFirstName(clientResponse.getFirstName());
        request.setLastName(clientResponse.getLastName());
        request.setPhoneNumber(clientResponse.getPhoneNumber());
        // остальные поля по аналогии

        model.addAttribute("clientRequest", request);
        model.addAttribute("clientId", id);
        return "clients/edit";
    }

    // --- Обновление клиента ---
    @PostMapping("/edit/{id}")
    public String updateClient(@PathVariable Long id,
                               @Valid @ModelAttribute("clientRequest") ClientRequest request,
                               BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("clientId", id);
            return "clients/edit";
        }
        clientService.updateClient(id, request);
        return "redirect:/clients";
    }

    // --- Удаление клиента ---
    @PostMapping("/delete/{id}")
    public String deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return "redirect:/clients";
    }

    // --- Поиск клиентов ---
    @GetMapping("/search")
    public String searchClients(@RequestParam String keyword, Model model) {
        model.addAttribute("clients", clientService.searchClients(keyword));
        model.addAttribute("keyword", keyword);
        return "clients/list";
    }
}