package com.example.demo.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  @Value("${jwt.secret:}")
  private String secret;

  @Value("${jwt.expiration-ms:3600000}")
  private long expirationMs;

  private Key key;

  @PostConstruct
  public void init() {
    if (secret == null || secret.isBlank()) {
      key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    } else {
      key = Keys.hmacShaKeyFor(secret.getBytes());
    }
  }

  public String generateToken(String userId) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationMs);
    return Jwts.builder()
        .setSubject(userId)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(key)
        .compact();
  }

  public String getUserIdFromToken(String token) {
    try {
      Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
      return claims.getSubject();
    } catch (JwtException | IllegalArgumentException e) {
      return null;
    }
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public long getExpirationMs() {
    return expirationMs;
  }
}
