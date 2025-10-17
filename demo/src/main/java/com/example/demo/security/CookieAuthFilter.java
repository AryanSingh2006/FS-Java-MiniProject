package com.example.demo.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CookieAuthFilter implements Filter {

  @Autowired
  private JwtUtil jwtUtil;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    String cookieUser = null;
    Cookie[] cookies = req.getCookies();
    if (cookies != null) {
      for (Cookie c : cookies) {
        if ("AUTH_TOKEN".equals(c.getName())) {
          String token = c.getValue();
          if (token != null && jwtUtil.validateToken(token)) {
            cookieUser = jwtUtil.getUserIdFromToken(token);
            break;
          }
        }
      }
    }

    if (cookieUser != null) {
      // make the user id available to controllers
      req.setAttribute("currentUserId", cookieUser);
    }

    chain.doFilter(request, response);
  }
}
