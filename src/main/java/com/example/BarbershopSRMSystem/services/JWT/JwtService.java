package com.example.BarbershopSRMSystem.services.JWT;

import com.example.BarbershopSRMSystem.entities.User;
import com.example.BarbershopSRMSystem.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final UserRepository userRepository;
    private final Key key;

    public JwtService(UserRepository userRepository,
                      @Value("${jwt.secret}") String secret) {
        this.userRepository = userRepository;
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole().getRoleName();

        // Добавляем префикс ROLE_ если его нет
        String roleForToken = role.startsWith("ROLE_") ? role : "ROLE_" + role;

        System.out.println("Генерируем токен для: " + username + ", роль: " + roleForToken);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", roleForToken) // Теперь будет "ROLE_ADMIN"
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 24 * 3600 * 1000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}