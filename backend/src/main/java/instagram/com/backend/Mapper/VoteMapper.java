package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.Vote;
import instagram.com.backend.Entity.Response.VoteResponse;

@Component
public class VoteMapper {

    @Autowired
    UserMapper userMapper;
    
    public VoteResponse mapVoteToResponse(Vote vote) {
        VoteResponse response = new VoteResponse(vote.getId(), userMapper.mapUserToUserResponse(vote.getOwner()), vote.getPoll().getId(), vote.getChoice().getId());
        return response;
    }
}
