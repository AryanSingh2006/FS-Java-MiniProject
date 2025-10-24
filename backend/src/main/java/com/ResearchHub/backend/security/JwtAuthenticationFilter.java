package com.ResearchHub.backend.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ResearchHub.backend.Repository.UserRepository;
import com.ResearchHub.backend.model.UserModel;
import com.ResearchHub.backend.util.JwtUtil;

import org.springframework.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final UserRepository userRepository;

  public JwtAuthenticationFilter(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain) throws ServletException, IOException {

    // If already authenticated, continue
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
      String token = extractJwtFromCookie(request);
      if (token != null && !token.isEmpty()) {
        try {
          String email = JwtUtil.getEmailFromToken(token);
          if (email != null) {
            UserModel user = userRepository.findByEmail(email);
            if (user != null) {
              UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                  user, null, Collections.emptyList());
              SecurityContextHolder.getContext().setAuthentication(auth);
            }
          }
        } catch (Exception ex) {
          // Invalid/expired token -> ignore and continue without auth
        }
      }
    }

    filterChain.doFilter(request, response);
  }

  private String extractJwtFromCookie(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null)
      return null;
    for (Cookie c : cookies) {
      if ("jwt".equals(c.getName())) {
        return c.getValue();
      }
    }
    return null;
  }
}
