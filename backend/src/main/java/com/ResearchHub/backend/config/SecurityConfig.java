package com.ResearchHub.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ResearchHub.backend.Repository.UserRepository;
import com.ResearchHub.backend.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, UserRepository userRepository) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/auth/register", "/auth/login", "/auth/logout", "/repos/global",
                "/papers/by-repo/**", "/papers/*/download", "/papers/*/download/*", "/papers/activity/**")
            .permitAll()
            .anyRequest().authenticated())
        .addFilterBefore(new JwtAuthenticationFilter(userRepository), UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  // Allow common dev origins and credentials for cookie-based auth
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(java.util.List.of("http://localhost:*", "http://127.0.0.1:*"));
    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(java.util.List.of("Content-Type", "Authorization", "X-Requested-With"));
    config.setAllowCredentials(true);
    config.setExposedHeaders(java.util.List.of("Location", "Set-Cookie"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}
