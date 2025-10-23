package com.ResearchHub.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.ResearchHub.backend.model.UserModel;

public final class SecurityUtils {
  private SecurityUtils() {
  }

  public static String getCurrentUserEmail() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null)
      return null;
    Object principal = auth.getPrincipal();
    if (principal instanceof UserModel user) {
      return user.getEmail();
    }
    return null;
  }
}
