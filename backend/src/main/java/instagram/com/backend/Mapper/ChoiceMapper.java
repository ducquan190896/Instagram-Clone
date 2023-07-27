package instagram.com.backend.Mapper;

import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.Choice;
import instagram.com.backend.Entity.Response.ChoiceResponse;

@Component
public class ChoiceMapper {
    
    public ChoiceResponse mapChoiceToResponse(Choice choice) {
        ChoiceResponse response = new ChoiceResponse(choice.getId(), choice.getAnswer(), choice.getVoteCount(), choice.getPoll().getId());
        return response;
    }
}
