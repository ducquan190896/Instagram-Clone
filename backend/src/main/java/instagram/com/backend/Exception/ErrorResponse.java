package instagram.com.backend.Exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class ErrorResponse {
        private String message;
        private Throwable throwable;
        private LocalDateTime localDateTime = LocalDateTime.now();

        public ErrorResponse(String message, Throwable throwable) {
            this.message = message;
            this.throwable = throwable;
        }

        
}
