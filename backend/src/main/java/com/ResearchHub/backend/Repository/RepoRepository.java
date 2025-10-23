package com.ResearchHub.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ResearchHub.backend.model.RepoModel;

public interface RepoRepository extends MongoRepository<RepoModel, String> {
  List<RepoModel> findByOwnerEmail(String ownerEmail);
}
