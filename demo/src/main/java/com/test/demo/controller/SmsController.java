package com.test.demo.controller;

import com.darpan.communication.model.SmsRequest;
import com.darpan.communication.model.SmsResponse;
import com.darpan.communication.service.impl.AwsSnsMessageService;
import com.darpan.communication.service.impl.BirdHttpSmsService;
import com.darpan.communication.service.impl.MicrosoftSmsService;
import com.darpan.communication.service.impl.TwilioMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/smpp")
@RequiredArgsConstructor
public class SmsController {

    private final TwilioMessageService twilioMessageService;
    private final BirdHttpSmsService messageBirdService;
    private final AwsSnsMessageService awsSnsMessageService;
    private final MicrosoftSmsService microsoftSmsService;


    @PostMapping("/twilio")
    public CompletableFuture<SmsResponse> sendTwilioMessage(@RequestBody SmsRequest request) {
        return twilioMessageService.sendMessageAsync(request);
    }

    @PostMapping("/aws")
    public CompletableFuture<SmsResponse> sendAwsMessage(@RequestBody SmsRequest request) {
        return awsSnsMessageService.sendMessageAsync(request);
    }

    @PostMapping("/messagebird")
    public CompletableFuture<SmsResponse> sendMessageBirdMessage(@RequestBody SmsRequest request) {
        return messageBirdService.sendMessageAsync(request);
    }

    @PostMapping("/microsoft")
    public CompletableFuture<SmsResponse> sendMicrosoftMessage(@RequestBody SmsRequest request) {
        return microsoftSmsService.sendMessageAsync(request);
    }
}

