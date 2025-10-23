package com.ResearchHub.backend.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ResearchHub.backend.Repository.PaperRepository;
import com.ResearchHub.backend.Repository.RepoRepository;
import com.ResearchHub.backend.model.PaperModel;
import com.ResearchHub.backend.model.RepoModel;
import com.ResearchHub.backend.security.SecurityUtils;
import com.ResearchHub.backend.service.CloudinaryService;

@RestController
@RequestMapping("/papers")
public class PaperController {

  @Autowired
  private PaperRepository paperRepository;
  @Autowired
  private RepoRepository repoRepository;
  @Autowired
  private CloudinaryService cloudinaryService;

  // Upload a new paper to a repo (creates PaperModel with version 1)
  @PostMapping("/upload")
  public ResponseEntity<?> uploadPaper(
      @RequestParam("repoId") String repoId,
      @RequestParam("title") String title,
      @RequestParam("file") MultipartFile file) throws IOException {
    String email = SecurityUtils.getCurrentUserEmail();
    if (email == null)
      return ResponseEntity.status(401).body("Unauthorized");

    if (!isAllowedFile(file))
      return ResponseEntity.badRequest().body("Only PDF/DOC/DOCX allowed");
    if (!isWithinSizeLimit(file))
      return ResponseEntity.badRequest().body("File too large (max 20MB)");

    RepoModel repo = repoRepository.findById(repoId).orElse(null);
    if (repo == null)
      return ResponseEntity.status(404).body("Repo not found");
    if (!repo.getOwnerEmail().equals(email)) {
      return ResponseEntity.status(403).body("Forbidden: not your repo");
    }

    Map<String, Object> upload = cloudinaryService.uploadFile(file, "repos/" + repoId);
    String url = (String) upload.get("secure_url");
    String publicId = (String) upload.get("public_id");

    PaperModel paper = new PaperModel();
    paper.setRepoId(repoId);
    paper.setOwnerEmail(email);
    paper.setTitle(title);

    PaperModel.Version v1 = new PaperModel.Version();
    v1.setVersionNumber(1);
    v1.setFileName(file.getOriginalFilename());
    v1.setFileType(file.getContentType());
    v1.setUrl(url);
    v1.setPublicId(publicId);

    List<PaperModel.Version> versions = new ArrayList<>();
    versions.add(v1);
    paper.setVersions(versions);
    paper.setCurrentVersion(1);

    PaperModel saved = paperRepository.save(paper);
    return ResponseEntity.ok(saved);
  }

  // List current user's papers (latest version summary)
  @GetMapping("/my")
  public ResponseEntity<?> myPapers() {
    String email = SecurityUtils.getCurrentUserEmail();
    if (email == null)
      return ResponseEntity.status(401).body("Unauthorized");
    List<PaperModel> list = paperRepository.findByOwnerEmail(email);
    return ResponseEntity.ok(list);
  }

  // --- helpers ---
  private boolean isAllowedFile(MultipartFile file) {
    String name = file.getOriginalFilename();
    if (name == null)
      return false;
    String lower = name.toLowerCase();
    return lower.endsWith(".pdf") || lower.endsWith(".doc") || lower.endsWith(".docx");
  }

  private boolean isWithinSizeLimit(MultipartFile file) {
    // 20 MB limit
    long MAX = 20L * 1024 * 1024;
    return file.getSize() <= MAX;
  }

  // List papers within a specific repo (public)
  @GetMapping("/by-repo/{repoId}")
  public ResponseEntity<?> papersByRepo(@PathVariable String repoId) {
    List<PaperModel> list = paperRepository.findByRepoId(repoId);
    // Map to latest-version summaries for lighter payload
    List<Map<String, Object>> summaries = new ArrayList<>();
    for (PaperModel p : list) {
      Map<String, Object> m = new java.util.HashMap<>();
      m.put("paperId", p.getId());
      m.put("title", p.getTitle());
      m.put("currentVersion", p.getCurrentVersion());
      m.put("ownerEmail", p.getOwnerEmail()); // Include owner email
      // latest upload timestamp and url
      PaperModel.Version latest = p.getVersions().stream()
          .filter(v -> v.getVersionNumber() == p.getCurrentVersion())
          .findFirst().orElse(null);
      if (latest != null) {
        m.put("uploadedAt", latest.getUploadedAt());
        m.put("url", latest.getUrl());
        m.put("fileName", latest.getFileName());
        m.put("fileType", latest.getFileType());
      }
      summaries.add(m);
    }
    return ResponseEntity.ok(summaries);
  }

  // Get all versions for a paper
  @GetMapping("/{paperId}/versions")
  public ResponseEntity<?> paperVersions(@PathVariable String paperId) {
    return paperRepository.findById(paperId)
        .<ResponseEntity<?>>map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.status(404).body("Paper not found"));
  }

  // Download latest version by streaming bytes from Cloudinary (attachment or
  // inline for preview)
  @GetMapping("/{paperId}/download")
  public ResponseEntity<?> downloadLatest(
      @PathVariable String paperId,
      @RequestParam(value = "inline", defaultValue = "false") boolean inline) throws IOException {
    var opt = paperRepository.findById(paperId);
    if (opt.isEmpty()) {
      return ResponseEntity.status(404).body("Paper not found");
    }
    var paper = opt.get();
    int latest = paper.getCurrentVersion();
    return downloadVersion(paper, latest, inline);
  }

  // Download specific version by streaming bytes from Cloudinary (attachment or
  // inline for preview)
  @GetMapping("/{paperId}/download/{versionNumber}")
  public ResponseEntity<?> downloadSpecificVersion(
      @PathVariable String paperId,
      @PathVariable int versionNumber,
      @RequestParam(value = "inline", defaultValue = "false") boolean inline) throws IOException {
    var opt = paperRepository.findById(paperId);
    if (opt.isEmpty()) {
      return ResponseEntity.status(404).body("Paper not found");
    }
    var paper = opt.get();
    return downloadVersion(paper, versionNumber, inline);
  }

  // Helper method to download a specific version
  private ResponseEntity<?> downloadVersion(PaperModel paper, int versionNumber, boolean inline) throws IOException {
    var versionOpt = paper.getVersions().stream()
        .filter(v -> v.getVersionNumber() == versionNumber)
        .findFirst();
    if (versionOpt.isEmpty()) {
      return ResponseEntity.status(404).body("Version " + versionNumber + " not found");
    }

    String fileUrl = versionOpt.get().getUrl();
    String fileName = versionOpt.get().getFileName();
    String fileType = versionOpt.get().getFileType();

    java.net.URI uri = java.net.URI.create(fileUrl);
    java.net.URL url = uri.toURL();
    java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
    connection.setRequestMethod("GET");
    connection.setConnectTimeout(10000);
    connection.setReadTimeout(30000);

    try (java.io.InputStream in = connection.getInputStream()) {
      byte[] bytes = in.readAllBytes();
      long length = bytes.length;
      if (fileType == null || fileType.isBlank()) {
        fileType = connection.getContentType();
        if (fileType == null || fileType.isBlank())
          fileType = "application/octet-stream";
      }
      if (fileName == null || fileName.isBlank()) {
        String path = url.getPath();
        fileName = path.substring(path.lastIndexOf('/') + 1);
      }

      // Use "inline" for preview, "attachment" for download
      String contentDisposition = inline
          ? "inline; filename=\"" + fileName + "\""
          : "attachment; filename=\"" + fileName + "\"";

      return ResponseEntity.ok()
          .header("Content-Disposition", contentDisposition)
          .header("Content-Type", fileType)
          .header("Content-Length", String.valueOf(length))
          .body(bytes);
    } finally {
      connection.disconnect();
    }
  }

  // Upload a new version to an existing paper (owner only)
  @PostMapping("/{paperId}/update")
  public ResponseEntity<?> updatePaper(
      @PathVariable String paperId,
      @RequestParam("file") MultipartFile file) throws IOException {
    String email = SecurityUtils.getCurrentUserEmail();
    if (email == null)
      return ResponseEntity.status(401).body("Unauthorized");

    if (!isAllowedFile(file))
      return ResponseEntity.badRequest().body("Only PDF/DOC/DOCX allowed");
    if (!isWithinSizeLimit(file))
      return ResponseEntity.badRequest().body("File too large (max 20MB)");

    PaperModel paper = paperRepository.findById(paperId).orElse(null);
    if (paper == null)
      return ResponseEntity.status(404).body("Paper not found");
    if (!email.equals(paper.getOwnerEmail()))
      return ResponseEntity.status(403).body("Forbidden");

    Map<String, Object> upload = cloudinaryService.uploadFile(file, "repos/" + paper.getRepoId());
    String url = (String) upload.get("secure_url");
    String publicId = (String) upload.get("public_id");

    int nextVersion = paper.getCurrentVersion() + 1;
    PaperModel.Version v = new PaperModel.Version();
    v.setVersionNumber(nextVersion);
    v.setFileName(file.getOriginalFilename());
    v.setFileType(file.getContentType());
    v.setUrl(url);
    v.setPublicId(publicId);

    List<PaperModel.Version> versions = paper.getVersions();
    if (versions == null)
      versions = new ArrayList<>();
    versions.add(v);
    paper.setVersions(versions);
    paper.setCurrentVersion(nextVersion);

    PaperModel saved = paperRepository.save(paper);
    return ResponseEntity.ok(saved);
  }

  // Get recent activity for a repo (all version events chronologically)
  @GetMapping("/activity/{repoId}")
  public ResponseEntity<?> getRepoActivity(@PathVariable String repoId) {
    List<PaperModel> papers = paperRepository.findByRepoId(repoId);
    List<Map<String, Object>> activities = new ArrayList<>();

    // Extract all versions from all papers
    for (PaperModel paper : papers) {
      List<PaperModel.Version> versions = paper.getVersions();
      if (versions == null || versions.isEmpty())
        continue;

      for (PaperModel.Version version : versions) {
        Map<String, Object> activity = new java.util.HashMap<>();
        activity.put("paperId", paper.getId());
        activity.put("paperTitle", paper.getTitle());
        activity.put("ownerEmail", paper.getOwnerEmail());
        activity.put("versionNumber", version.getVersionNumber());
        activity.put("fileName", version.getFileName());
        activity.put("fileType", version.getFileType());
        activity.put("uploadedAt", version.getUploadedAt());
        activity.put("url", version.getUrl());
        // Determine if this is initial upload or an update
        activity.put("actionType", version.getVersionNumber() == 1 ? "uploaded" : "updated");
        activities.add(activity);
      }
    }

    // Sort by uploadedAt descending (most recent first)
    activities.sort((a, b) -> {
      var timeA = (java.time.Instant) a.get("uploadedAt");
      var timeB = (java.time.Instant) b.get("uploadedAt");
      return timeB.compareTo(timeA);
    });

    return ResponseEntity.ok(activities);
  }

  // Delete a paper (owner only) - deletes all versions from Cloudinary and
  // MongoDB
  @org.springframework.web.bind.annotation.DeleteMapping("/{paperId}")
  public ResponseEntity<?> deletePaper(@PathVariable String paperId) throws IOException {
    String email = SecurityUtils.getCurrentUserEmail();
    if (email == null)
      return ResponseEntity.status(401).body("Unauthorized");

    PaperModel paper = paperRepository.findById(paperId).orElse(null);
    if (paper == null)
      return ResponseEntity.status(404).body("Paper not found");

    // Only owner can delete
    if (!email.equals(paper.getOwnerEmail()))
      return ResponseEntity.status(403).body("Forbidden: not your paper");

    // Delete all file versions from Cloudinary
    List<PaperModel.Version> versions = paper.getVersions();
    if (versions != null && !versions.isEmpty()) {
      for (PaperModel.Version version : versions) {
        String publicId = version.getPublicId();
        if (publicId != null && !publicId.isBlank()) {
          try {
            cloudinaryService.deleteFile(publicId);
          } catch (Exception e) {
            // Log but continue if Cloudinary deletion fails
            System.err.println("Failed to delete file from Cloudinary: " + publicId + " - " + e.getMessage());
          }
        }
      }
    }

    // Delete paper document from MongoDB
    paperRepository.deleteById(paperId);

    return ResponseEntity.ok(Map.of("message", "Paper deleted successfully", "paperId", paperId));
  }
}
