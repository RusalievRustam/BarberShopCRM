package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.requests.UserRequest;
import com.example.BarbershopSRMSystem.entities.Roles;
import com.example.BarbershopSRMSystem.entities.User;
import com.example.BarbershopSRMSystem.services.DatabaseUserDetailsService;
import com.example.BarbershopSRMSystem.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final DatabaseUserDetailsService userService;
    private final RoleService roleService;

    // --- Список пользователей ---
    @GetMapping
    public String usersList(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
    }

    // --- Форма создания нового пользователя ---
    @GetMapping("/create")
    public String createUserForm(Model model) {
        model.addAttribute("userRequest", new UserRequest());
        model.addAttribute("roles", roleService.getAllRoles());
        return "register";
    }

    // --- Обработка создания пользователя ---
    @PostMapping("/create")
    public String createUser(@ModelAttribute("userRequest") UserRequest request) {
        Roles role = roleService.getRoleByName(request.getRole());
        User newUser = userService.createUser(request, role);

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                        newUser.getUsername(),
                        newUser.getPassword(),
                        newUser.getAuthorities()
                );
        userService.createUser(request, role);
        return "redirect:/users";
    }

    // --- Текущий пользователь ---
    @GetMapping("/login")
    public String currentUser(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        model.addAttribute("username", authentication.getName());
        return "login";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "redirect:/users";
    }

    @GetMapping("/edit/{id}")
    public String editUserForm(@PathVariable Long id, Model model) {
        User user = userService.getUserById(id);
        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(user.getUsername());
        userRequest.setRole(user.getRole().getRoleName());

        model.addAttribute("userRequest", userRequest);
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("userId", id);

        return "edit";
    }

    @PostMapping("/edit/{id}")
    public String updateUser(@PathVariable Long id,
                             @ModelAttribute("userRequest") UserRequest request) {
        userService.updateUser(request, id);
        return "redirect:/users";
    }
}