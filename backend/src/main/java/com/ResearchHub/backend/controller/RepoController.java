package com.ResearchHub.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ResearchHub.backend.Repository.RepoRepository;
import com.ResearchHub.backend.model.RepoModel;

import com.ResearchHub.backend.security.SecurityUtils;

@RestController
@RequestMapping("/repos")
public class RepoController {

  @Autowired
  private RepoRepository repoRepository;

  @PostMapping
  public ResponseEntity<?> createRepo(@RequestBody RepoModel repo) {
    String email = SecurityUtils.getCurrentUserEmail();
    if (email == null)
      return ResponseEntity.status(401).body("Unauthorized");
    repo.setOwnerEmail(email);
    RepoModel saved = repoRepository.save(repo);
    return ResponseEntity.ok(saved);
  }

  @GetMapping("/my")
  public ResponseEntity<?> myRepos() {
    String email = SecurityUtils.getCurrentUserEmail();
    if (email == null)
      return ResponseEntity.status(401).body("Unauthorized");
    List<RepoModel> repos = repoRepository.findByOwnerEmail(email);
    return ResponseEntity.ok(repos);
  }

  // Public: list all repos (Global)
  @GetMapping("/global")
  public ResponseEntity<?> globalRepos() {
    List<RepoModel> all = repoRepository.findAll();
    return ResponseEntity.ok(all);
  }

  // Delete a repository (owner only)
  @DeleteMapping("/{repoId}")
  public ResponseEntity<?> deleteRepo(@PathVariable String repoId) {
    String email = SecurityUtils.getCurrentUserEmail();
    if (email == null)
      return ResponseEntity.status(401).body("Unauthorized");

    // Check if repo exists
    var repoOpt = repoRepository.findById(repoId);
    if (repoOpt.isEmpty())
      return ResponseEntity.status(404).body("Repository not found");

    RepoModel repo = repoOpt.get();

    // Check ownership
    if (!email.equals(repo.getOwnerEmail()))
      return ResponseEntity.status(403).body("Forbidden: You can only delete your own repositories");

    // Delete the repository
    repoRepository.deleteById(repoId);
    return ResponseEntity.ok("Repository deleted successfully");
  }
}
