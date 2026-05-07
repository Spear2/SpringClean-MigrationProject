package com.project.SpringClean.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Use secure key (NOT plain string)
    private final Key SECRET_KEY = Keys.hmacShaKeyFor(
            "johannepinakagwaposatanan123456123ABCD".getBytes()
    );

    public String generateToken(String email, String userType) {
        return Jwts.builder()
                .claim("email", email)
                .claim("type", userType)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
