package com.ResearchHub.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ResearchHub.backend.model.UserModel;
import com.ResearchHub.backend.Repository.UserRepository;
import com.ResearchHub.backend.util.JwtUtil;
import com.ResearchHub.backend.security.SecurityUtils;

@RestController
@RequestMapping("/auth") // Base URL for authentication APIs
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // BCrypt for password hashing and verification
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ===================== REGISTER =====================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserModel user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // Save user to MongoDB
        UserModel savedUser = userRepository.save(user);

        // Generate JWT token
        String jwt = JwtUtil.generateToken(savedUser.getUsername(), savedUser.getEmail());
        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .secure(false) // set true when serving over HTTPS
                .build();

        // Do not send password back in response
        savedUser.setPassword(null);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(savedUser);
    }

    // ===================== LOGIN =====================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserModel user) {
        // Find user by email
        UserModel existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(404).body("User not found!");
        }

        // Compare password using BCrypt
        boolean passwordMatches = passwordEncoder.matches(user.getPassword(), existingUser.getPassword());
        if (!passwordMatches) {
            return ResponseEntity.badRequest().body("Invalid password!");
        }

        // Generate JWT token
        String jwt = JwtUtil.generateToken(existingUser.getUsername(), existingUser.getEmail());
        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .secure(false) // set true when serving over HTTPS
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Login successful! Welcome, " + existingUser.getUsername());
    }

    // ===================== LOGOUT =====================
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Invalidate the JWT cookie by setting maxAge to 0
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .secure(false)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully.");
    }

    // ===================== GET CURRENT USER =====================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        UserModel user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Don't send password
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
