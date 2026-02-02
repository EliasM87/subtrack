package com.portfolio.subtrack.repository;

import com.portfolio.subtrack.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    // Spring Data JPA nos da todo lo básico (CRUD) automáticamente
}
