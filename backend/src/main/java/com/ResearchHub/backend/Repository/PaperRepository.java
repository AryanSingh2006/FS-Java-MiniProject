package com.ResearchHub.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ResearchHub.backend.model.PaperModel;

public interface PaperRepository extends MongoRepository<PaperModel, String> {
  List<PaperModel> findByOwnerEmail(String ownerEmail);

  List<PaperModel> findByRepoId(String repoId);
}
