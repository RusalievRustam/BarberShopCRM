package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.ClientResponse;
import com.example.BarbershopSRMSystem.dto.requests.ClientRequest;
import com.example.BarbershopSRMSystem.entities.Client;
import com.example.BarbershopSRMSystem.mapping.ClientMapper;
import com.example.BarbershopSRMSystem.repositories.ClientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ClientService {

    private ClientRepository clientRepository;
    private ClientMapper clientMapper;

    public ClientResponse createClient(ClientRequest request) {
        Client client = clientMapper.mapToEntity(request);
        Client saved = clientRepository.save(client);
        return clientMapper.mapToResponse(saved);
    }

    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(clientMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse getClientById(Long id) {
        return clientMapper.mapToResponse(getClientEntityById(id));
    }

    public Client getClientEntityById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Клиент с id " + id + " не найден"));
    }


    public ClientResponse updateClient(Long id, ClientRequest request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Клиент с id " + id + " не найден"));
        clientMapper.updateEntityFromRequest(request, client);
        clientRepository.save(client);
        return clientMapper.mapToResponse(client);
    }

    public List<ClientResponse> searchClients(String keyword) {
        return clientRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(clientMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ClientResponse> findByPhoneNumber(String phoneNumber) {
        return clientRepository.findByPhoneNumberContaining(phoneNumber)
                .stream()
                .map(clientMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
