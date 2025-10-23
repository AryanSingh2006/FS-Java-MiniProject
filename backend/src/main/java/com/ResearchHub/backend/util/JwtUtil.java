package com.ResearchHub.backend.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
  private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
  private static final long EXPIRATION_TIME = 86400000; // 1 day in ms

  public static String generateToken(String username, String email) {
    return Jwts.builder()
        .setSubject(username)
        .claim("email", email)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(key)
        .compact();
  }

  public static String getUsernameFromToken(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(token).getBody().getSubject();
  }

  public static String getEmailFromToken(String token) {
    return (String) Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(token).getBody().get("email");
  }
}
