package com.example.demo.repository;

import com.example.demo.model.DocumentVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DocumentVersionRepository extends MongoRepository<DocumentVersion, String> {
  List<DocumentVersion> findByDocIdOrderByUploadedAtDesc(String docId);
}
