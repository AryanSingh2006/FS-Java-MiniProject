package com.example.demo.controller;

import com.example.demo.dto.AuthDtos;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private com.example.demo.security.JwtUtil jwtUtil;

  // JWT removed: no token generation

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody AuthDtos.RegisterRequest req, HttpServletResponse response) {
    Optional<User> existing = userRepository.findByEmail(req.email);
    if (existing.isPresent()) {
      return ResponseEntity.badRequest().body("Email already registered");
    }

    User u = new User();
    u.setUsername(req.username);
    u.setEmail(req.email);
    u.setPasswordHash(passwordEncoder.encode(req.password));
    userRepository.save(u);
    String token = jwtUtil.generateToken(u.getId());
    // build Set-Cookie header to include SameSite=None and Secure; HttpOnly is set
    int maxAgeSec = (int) (jwtUtil.getExpirationMs() / 1000L);
    String cookie = String.format("AUTH_TOKEN=%s; Max-Age=%d; Path=/; HttpOnly; SameSite=None; Secure", token,
        maxAgeSec);
    response.setHeader("Set-Cookie", cookie);

    return ResponseEntity.ok(new AuthDtos.AuthResponse(u.getId()));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest req, HttpServletResponse response) {
    Optional<User> userOpt = userRepository.findByEmail(req.email);
    if (userOpt.isEmpty())
      return ResponseEntity.status(401).body("Invalid credentials");

    User u = userOpt.get();
    if (!passwordEncoder.matches(req.password, u.getPasswordHash())) {
      return ResponseEntity.status(401).body("Invalid credentials");
    }

    String token = jwtUtil.generateToken(u.getId());
    int maxAgeSec = (int) (jwtUtil.getExpirationMs() / 1000L);
    String cookie = String.format("AUTH_TOKEN=%s; Max-Age=%d; Path=/; HttpOnly; SameSite=None; Secure", token,
        maxAgeSec);
    response.setHeader("Set-Cookie", cookie);
    return ResponseEntity.ok(new AuthDtos.AuthResponse(u.getId()));
  }
}
