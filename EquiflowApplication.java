import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Equiflow backend.
 * Run with: mvn spring-boot:run
 * or: java -jar equiflow-backend.jar
 */
@SpringBootApplication
public class EquiflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(EquiflowApplication.class, args);
        System.out.println("Equiflow backend started. Try: http://localhost:8080/api/projects");
    }
}
