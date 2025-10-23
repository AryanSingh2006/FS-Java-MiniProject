package com.ResearchHub.backend.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "repos")
public class RepoModel {
  @Id
  private String id;
  private String name;
  private String description;
  private String ownerEmail; // identify owner by email for simplicity
  private Instant createdAt = Instant.now();

  public RepoModel() {
  }

  public RepoModel(String name, String description, String ownerEmail) {
    this.name = name;
    this.description = description;
    this.ownerEmail = ownerEmail;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public String getOwnerEmail() {
    return ownerEmail;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setOwnerEmail(String ownerEmail) {
    this.ownerEmail = ownerEmail;
  }
}
