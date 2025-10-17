package com.example.demo.controller;

import com.example.demo.model.Doc;
import com.example.demo.model.DocumentVersion;
import com.example.demo.repository.DocRepository;
import com.example.demo.repository.DocumentVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/repositories/{repoId}/documents")
public class DocumentController {

  @Autowired
  private DocRepository docRepository;

  @Autowired
  private DocumentVersionRepository versionRepository;

  @Autowired(required = false)
  private GridFsTemplate gridFsTemplate;

  @PostMapping
  public ResponseEntity<?> uploadDocument(@PathVariable String repoId, @RequestParam MultipartFile file,
      @RequestParam(required = false) String title,
      @RequestParam(required = false) String description,
      @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
      @RequestParam(value = "ownerId", required = false) String ownerIdParam,
      jakarta.servlet.http.HttpServletRequest req) throws Exception {
    Doc d = new Doc();
    d.setRepoId(repoId);
    Object attr = req.getAttribute("currentUserId");
    String ownerId = attr != null ? attr.toString()
        : (headerUserId != null ? headerUserId : (ownerIdParam != null ? ownerIdParam : "anonymous"));
    d.setOwnerId(ownerId);
    d.setFilename(file.getOriginalFilename());
    d.setTitle(title);
    d.setDescription(description);

    if (gridFsTemplate != null) {
      try (InputStream in = file.getInputStream()) {
        var id = gridFsTemplate.store(in, file.getOriginalFilename(), file.getContentType());
        d.setCurrentGridFsId(id.toString());
      }
    }

    docRepository.save(d);
    return ResponseEntity.ok(d);
  }

  @GetMapping("/{docId}/download")
  public ResponseEntity<?> downloadDocument(@PathVariable String repoId, @PathVariable String docId) throws Exception {
    Doc d = docRepository.findById(docId).orElseThrow(() -> new RuntimeException("Not found"));
    if (!d.getRepoId().equals(repoId))
      throw new RuntimeException("Repo mismatch");

    if (gridFsTemplate == null || d.getCurrentGridFsId() == null)
      return ResponseEntity.status(404).body("No file available for this document");

    ObjectId oid;
    try {
      oid = new ObjectId(d.getCurrentGridFsId());
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.status(400).body("Invalid stored file id");
    }

    GridFSFile gfile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(oid)));
    if (gfile == null)
      return ResponseEntity.status(404).body("Stored file not found");

    GridFsResource resource = gridFsTemplate.getResource(gfile);
    InputStreamResource isr = new InputStreamResource(resource.getInputStream());

    String contentType = resource.getContentType();
    if (contentType == null)
      contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + d.getFilename() + "\"")
        .body(isr);
  }

  @PutMapping("/{docId}")
  public ResponseEntity<?> updateDocument(@PathVariable String repoId, @PathVariable String docId,
      @RequestParam MultipartFile file,
      @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
      @RequestParam(value = "ownerId", required = false) String ownerIdParam,
      jakarta.servlet.http.HttpServletRequest req) throws Exception {
    Doc d = docRepository.findById(docId).orElseThrow(() -> new RuntimeException("Not found"));
    if (!d.getRepoId().equals(repoId))
      throw new RuntimeException("Repo mismatch");

    // save previous version
    if (d.getCurrentGridFsId() != null) {
      DocumentVersion v = new DocumentVersion();
      v.setDocId(docId);
      v.setGridFsId(d.getCurrentGridFsId());
      Object attr = req.getAttribute("currentUserId");
      String uploadedBy = attr != null ? attr.toString()
          : (headerUserId != null ? headerUserId : (ownerIdParam != null ? ownerIdParam : "anonymous"));
      v.setUploadedBy(uploadedBy);
      versionRepository.save(v);
    }

    if (gridFsTemplate != null) {
      try (InputStream in = file.getInputStream()) {
        var id = gridFsTemplate.store(in, file.getOriginalFilename(), file.getContentType());
        d.setCurrentGridFsId(id.toString());
      }
    }

    d.setFilename(file.getOriginalFilename());
    docRepository.save(d);
    return ResponseEntity.ok(d);
  }

  @GetMapping("/{docId}/versions")
  public ResponseEntity<?> listVersions(@PathVariable String repoId, @PathVariable String docId) {
    List<DocumentVersion> versions = versionRepository.findByDocIdOrderByUploadedAtDesc(docId);
    return ResponseEntity.ok(versions);
  }
}
