package com.example.demo.controller;

import com.example.demo.model.Repo;
import com.example.demo.repository.RepoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/repositories")
public class RepositoryController {

  @Autowired
  private RepoRepository repoRepository;

  @PostMapping
  public ResponseEntity<?> createRepo(@RequestBody Repo repo,
      @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
      @RequestParam(value = "ownerId", required = false) String ownerIdParam,
      jakarta.servlet.http.HttpServletRequest req) {
    Object attr = req.getAttribute("currentUserId");
    String ownerId = attr != null ? attr.toString()
        : (headerUserId != null ? headerUserId
            : (ownerIdParam != null ? ownerIdParam : "anonymous"));
    repo.setOwnerId(ownerId);
    repoRepository.save(repo);
    return ResponseEntity.ok(repo);
  }

  @GetMapping
  public ResponseEntity<?> listRepos(@RequestHeader(value = "X-User-Id", required = false) String headerUserId,
      @RequestParam(value = "ownerId", required = false) String ownerIdParam,
      jakarta.servlet.http.HttpServletRequest req) {
    Object attr = req.getAttribute("currentUserId");
    String ownerId = attr != null ? attr.toString()
        : (headerUserId != null ? headerUserId
            : (ownerIdParam != null ? ownerIdParam : "anonymous"));
    List<Repo> list = repoRepository.findByOwnerId(ownerId);
    return ResponseEntity.ok(list);
  }

  // convenience endpoint for the currently-provided user id
  @GetMapping("/me")
  public ResponseEntity<?> myRepos(@RequestHeader(value = "X-User-Id", required = false) String headerUserId,
      @RequestParam(value = "ownerId", required = false) String ownerIdParam,
      jakarta.servlet.http.HttpServletRequest req) {
    Object attr = req.getAttribute("currentUserId");
    String ownerId = attr != null ? attr.toString()
        : (headerUserId != null ? headerUserId
            : (ownerIdParam != null ? ownerIdParam : "anonymous"));
    List<Repo> list = repoRepository.findByOwnerId(ownerId);
    return ResponseEntity.ok(list);
  }
}
