package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "document_versions")
public class DocumentVersion {
  @Id
  private String id;
  private String docId;
  private String gridFsId;
  private String uploadedBy;
  private Instant uploadedAt = Instant.now();

  // getters/setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getDocId() {
    return docId;
  }

  public void setDocId(String docId) {
    this.docId = docId;
  }

  public String getGridFsId() {
    return gridFsId;
  }

  public void setGridFsId(String gridFsId) {
    this.gridFsId = gridFsId;
  }

  public String getUploadedBy() {
    return uploadedBy;
  }

  public void setUploadedBy(String uploadedBy) {
    this.uploadedBy = uploadedBy;
  }

  public Instant getUploadedAt() {
    return uploadedAt;
  }

  public void setUploadedAt(Instant uploadedAt) {
    this.uploadedAt = uploadedAt;
  }
}
