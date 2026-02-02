package com.portfolio.subtrack;

import com.portfolio.subtrack.entity.Subscription;
import com.portfolio.subtrack.repository.SubscriptionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component // Indica a Spring que debe gestionar esta clase
public class DataLoader implements CommandLineRunner {

    private final SubscriptionRepository repository;

    // Inyectamos el repositorio para poder guardar cosas
    public DataLoader(SubscriptionRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Solo cargamos datos si la base de datos está vacía
        if (repository.count() == 0) {

            Subscription netflix = new Subscription();
            netflix.setServiceName("Netflix Premium");
            netflix.setPrice(17.99);
            netflix.setCurrency("EUR");
            netflix.setFrequency("MONTHLY");
            netflix.setCategory("Streaming");
            netflix.setBillingDate(LocalDate.now().plusDays(5)); // Se cobra en 5 días

            Subscription spotify = new Subscription();
            spotify.setServiceName("Spotify Duo");
            spotify.setPrice(14.99);
            spotify.setCurrency("EUR");
            spotify.setFrequency("MONTHLY");
            spotify.setCategory("Música");
            spotify.setBillingDate(LocalDate.now().plusDays(10)); // Se cobra en 10 días

            Subscription gym = new Subscription();
            gym.setServiceName("McFit Gimnasio");
            gym.setPrice(29.90);
            gym.setCurrency("EUR");
            gym.setFrequency("MONTHLY");
            gym.setCategory("Fitness");
            gym.setBillingDate(LocalDate.now().plusDays(3)); // Se cobra en 3 días

            // Guardamos todos en la base de datos
            repository.save(netflix);
            repository.save(spotify);
            repository.save(gym);

            System.out.println("✅ Datos de prueba cargados correctamente");
        }
    }
}