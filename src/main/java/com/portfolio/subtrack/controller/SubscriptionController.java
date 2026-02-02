package com.portfolio.subtrack.controller;

import com.portfolio.subtrack.entity.Subscription;
import com.portfolio.subtrack.service.SubscriptionService;
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

    // GET: Pedir datos
    // URL Final: http://localhost:8080/api/subscriptions
    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return service.getAllSubscriptions();
    }

    // POST: Enviar datos para guardar
    // URL Final: http://localhost:8080/api/subscriptions
    @PostMapping
    public Subscription createSubscription(@RequestBody Subscription subscription) {
        return service.saveSubscription(subscription);
    }
}