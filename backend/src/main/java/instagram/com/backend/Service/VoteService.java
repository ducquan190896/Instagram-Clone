package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Response.VoteResponse;

public interface VoteService {
    // only for authUser
    VoteResponse addVote(Long pollId, Long choiceId);
    List<VoteResponse> getVotesByPoll(Long pollId);
}
