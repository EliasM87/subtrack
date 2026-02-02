package com.portfolio.subtrack.service;

import com.portfolio.subtrack.entity.Subscription;
import com.portfolio.subtrack.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Anotacion de Logica de Negocio para Spring
public class SubscriptionService {

    private final SubscriptionRepository repository;

    public SubscriptionService(SubscriptionRepository repository) {
        this.repository = repository;
    }

    public List<Subscription> getAllSubscriptions() {
        return repository.findAll();
    }

    // 3. Crear o Actualizar una suscripción
    public Subscription saveSubscription(Subscription subscription) {
        return repository.save(subscription);
    }

}
