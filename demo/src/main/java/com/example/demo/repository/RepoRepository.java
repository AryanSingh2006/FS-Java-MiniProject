package com.example.demo.repository;

import com.example.demo.model.Repo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RepoRepository extends MongoRepository<Repo, String> {
  List<Repo> findByOwnerId(String ownerId);
}
