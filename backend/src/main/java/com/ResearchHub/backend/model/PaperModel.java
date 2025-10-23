package com.ResearchHub.backend.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "papers")
public class PaperModel {
  @Id
  private String id;
  private String repoId;
  private String ownerEmail;
  private String title;
  private int currentVersion = 0;
  private List<Version> versions = new ArrayList<>();

  public static class Version {
    private int versionNumber;
    private String fileName;
    private String fileType;
    private String url;
    private String publicId;
    private Instant uploadedAt = Instant.now();

    public int getVersionNumber() {
      return versionNumber;
    }

    public String getFileName() {
      return fileName;
    }

    public String getFileType() {
      return fileType;
    }

    public String getUrl() {
      return url;
    }

    public String getPublicId() {
      return publicId;
    }

    public Instant getUploadedAt() {
      return uploadedAt;
    }

    public void setVersionNumber(int versionNumber) {
      this.versionNumber = versionNumber;
    }

    public void setFileName(String fileName) {
      this.fileName = fileName;
    }

    public void setFileType(String fileType) {
      this.fileType = fileType;
    }

    public void setUrl(String url) {
      this.url = url;
    }

    public void setPublicId(String publicId) {
      this.publicId = publicId;
    }

    public void setUploadedAt(Instant uploadedAt) {
      this.uploadedAt = uploadedAt;
    }
  }

  public String getId() {
    return id;
  }

  public String getRepoId() {
    return repoId;
  }

  public String getOwnerEmail() {
    return ownerEmail;
  }

  public String getTitle() {
    return title;
  }

  public int getCurrentVersion() {
    return currentVersion;
  }

  public List<Version> getVersions() {
    return versions;
  }

  public void setRepoId(String repoId) {
    this.repoId = repoId;
  }

  public void setOwnerEmail(String ownerEmail) {
    this.ownerEmail = ownerEmail;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setCurrentVersion(int currentVersion) {
    this.currentVersion = currentVersion;
  }

  public void setVersions(List<Version> versions) {
    this.versions = versions;
  }
}
