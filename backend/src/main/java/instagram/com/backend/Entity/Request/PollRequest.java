package instagram.com.backend.Entity.Request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PollRequest {
    private String question;
    private int expireDays;
    private List<String> choices;
}
