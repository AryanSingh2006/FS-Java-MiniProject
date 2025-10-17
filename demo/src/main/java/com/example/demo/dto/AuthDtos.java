package com.example.demo.dto;

public class AuthDtos {
  public static class RegisterRequest {
    public String username;
    public String email;
    public String password;
  }

  public static class LoginRequest {
    public String email;
    public String password;
  }

  public static class AuthResponse {
    public String userId;

    public AuthResponse(String userId) {
      this.userId = userId;
    }
  }
}
