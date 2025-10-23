package com.ResearchHub.backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.ResearchHub.backend.model.UserModel;

public interface UserRepository extends MongoRepository<UserModel, String> {
  UserModel findByEmail(String email);
}