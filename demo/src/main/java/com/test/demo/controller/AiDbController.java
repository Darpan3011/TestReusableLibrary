package com.test.demo.controller;

import com.darpan.databaseAiAgent.api.AgentResponse;
import com.darpan.databaseAiAgent.api.AskRequest;
import com.darpan.databaseAiAgent.service.ModelFactory;
import com.darpan.databaseAiAgent.service.SessionAgentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ratelimiter.annotation.RateLimit;

import java.util.Map;

@RestController
@RequestMapping("/aidb")
@Slf4j
public class AiDbController {

    private final SessionAgentService agentService;
    private final ModelFactory modelFactory;

    public AiDbController(SessionAgentService agentService, ModelFactory modelFactory) {
        this.agentService = agentService;
        this.modelFactory = modelFactory;
    }

    @RateLimit(limit = 2, windowSeconds = 10)
    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody AskRequest request) {
        AgentResponse resp = agentService.ask(request.getQuestion(), request.getModelName());
        if (!resp.isOk()) return ResponseEntity.badRequest().body(Map.of("error", resp.getError()));
        return ResponseEntity.ok(Map.of(
                "answer", resp.getAnswer(),
                "sql", resp.getSql(),
                "rows", resp.getRows()
        ));
    }

    @GetMapping("/config")
    public ResponseEntity<?> getConfig() {
        return ResponseEntity.ok(Map.of(
            "provider", modelFactory.getDefaultProvider()
        ));
    }

    @GetMapping("/context")
    public ResponseEntity<?> getContext() {
        return ResponseEntity.ok(Map.of("messages", agentService.getChatHistory()));
    }

    @DeleteMapping("/context")
    public ResponseEntity<?> clearContext() {
        agentService.clearContext();
        return ResponseEntity.ok(Map.of("message", "Context cleared"));
    }
}
