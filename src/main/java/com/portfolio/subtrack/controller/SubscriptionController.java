package com.portfolio.subtrack.controller;

import com.portfolio.subtrack.entity.Subscription;
import com.portfolio.subtrack.service.SubscriptionService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService service;

    // Inyectamos el servicio
    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return service.getAllSubscriptions();
    }

    @PostMapping
    public Subscription createSubscription(@Valid @RequestBody Subscription subscription) { // @Valid para usar la
                                                                                            // validacion
        return service.saveSubscription(subscription);
    }
}