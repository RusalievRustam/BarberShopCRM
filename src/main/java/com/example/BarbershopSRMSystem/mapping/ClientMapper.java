package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.ClientResponse;
import com.example.BarbershopSRMSystem.dto.requests.ClientRequest;
import com.example.BarbershopSRMSystem.entities.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {
    public Client mapToEntity(ClientRequest request) {
        Client client = new Client();
        applyRequestToEntity(request,client);
        return client;
    }

    public void updateEntityFromRequest(ClientRequest request, Client client) {
        applyRequestToEntity(request,client);
    }
    private void applyRequestToEntity(ClientRequest request, Client client){
        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setPhoneNumber(request.getPhoneNumber());
        client.setNotes(request.getNote());
    }

    public ClientResponse mapToResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getFirstName(),
                client.getLastName(),
                client.getPhoneNumber(),
                client.getNotes()
        );
    }
}
