package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.UserResponse;
import com.example.BarbershopSRMSystem.dto.requests.UserRequest;
import com.example.BarbershopSRMSystem.entities.Roles;
import com.example.BarbershopSRMSystem.entities.User;
import com.example.BarbershopSRMSystem.mapping.UserMapper;
import com.example.BarbershopSRMSystem.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // используем для шифрования новых паролей
    private final RoleService roleService;
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь : " + username + " не найден"));


        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().getRoleName())
                .disabled(!user.getActive())
                .build();
    }

    // 🔹 новый вариант метода
    public UserResponse createUser(UserRequest request) {
        User user = userMapper.mapToEntity(request);

        Roles roles = roleService.getRoleById(request.getRoleId());
        user.setRole(roles);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return userMapper.mapToResponse(saved);
    }

    public UserResponse getUserById(Long id) {
        return userMapper.mapToResponse(getUserEntityById(id));
    }

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public long countUsers() {
        return userRepository.count();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUser(UserRequest request, Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.userUpdateToEntity(request, user);

        if (request.getRoleId() != null) {
            Roles roles = roleService.getRoleById(request.getRoleId());
            user.setRole(roles);
        }

        if (request.getPassword() != null && request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        User updated = userRepository.save(user);
        return userMapper.mapToResponse(updated);
    }
}
