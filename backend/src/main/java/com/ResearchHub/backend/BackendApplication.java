package com.ResearchHub.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load .env file BEFORE Spring Boot starts
		try {
			// Try loading from current directory first (when running from project root)
			Dotenv dotenv = null;
			try {
				dotenv = Dotenv.configure()
						.directory("./backend")
						.load();
			} catch (Exception e) {
				// If not found, try current directory (when running from backend folder)
				dotenv = Dotenv.configure()
						.ignoreIfMissing()
						.load();
			}

			if (dotenv != null) {
				// Set as system properties so Spring Boot can read them
				dotenv.entries().forEach(entry -> {
					System.setProperty(entry.getKey(), entry.getValue());
				});
				System.out.println("✅ Environment variables loaded from .env file");
			}
		} catch (Exception e) {
			System.err.println("⚠️ Warning: Could not load .env file: " + e.getMessage());
			System.err.println("💡 Make sure .env file exists in the backend directory");
		}

		SpringApplication.run(BackendApplication.class, args);
	}

}
