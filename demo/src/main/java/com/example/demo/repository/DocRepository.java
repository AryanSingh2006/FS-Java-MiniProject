package com.example.demo.repository;

import com.example.demo.model.Doc;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DocRepository extends MongoRepository<Doc, String> {
  List<Doc> findByRepoId(String repoId);
}
