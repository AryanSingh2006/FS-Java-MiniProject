package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.bson.Document;

@Component
public class StartupLogger implements ApplicationListener<ApplicationReadyEvent> {

  private static final Logger log = LoggerFactory.getLogger(StartupLogger.class);

  @Autowired(required = false)
  private MongoTemplate mongoTemplate;

  @Override
  public void onApplicationEvent(ApplicationReadyEvent event) {
    log.info("Server started");

    if (mongoTemplate == null) {
      log.info("MongoTemplate not available - DB not connected (test profile or Mongo disabled)");
      return;
    }

    try {
      // lightweight ping: run a command to force a connection check
      Document result = mongoTemplate.executeCommand("{ ping: 1 }");
      if (result != null && result.containsKey("ok") && ((Number) result.get("ok")).intValue() == 1) {
        log.info("DB is connected");
      } else {
        log.warn("DB ping returned unexpected result: {}", result);
      }
    } catch (Exception e) {
      log.error("DB connection check failed: {}", e.getMessage());
    }
  }
}
