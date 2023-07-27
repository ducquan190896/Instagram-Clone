package instagram.com.backend.Service.ServiceImplement;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import instagram.com.backend.Entity.Choice;
import instagram.com.backend.Entity.Poll;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Vote;
import instagram.com.backend.Entity.Response.VoteResponse;
import instagram.com.backend.Exception.EntityexistingException;
import instagram.com.backend.Mapper.VoteMapper;
import instagram.com.backend.Repository.ChoiceRepos;
import instagram.com.backend.Repository.PollRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Repository.VoteRepos;
import instagram.com.backend.Service.UserService;
import instagram.com.backend.Service.VoteService;

@Service
public class VoteServiceIml implements VoteService {
    @Autowired
    VoteRepos voteRepos;
    @Autowired
    UsersRepos usersRepos;
    @Autowired
    PollRepos pollRepos;
    @Autowired
    ChoiceRepos ChoiceRepos;
    @Autowired
    VoteMapper voteMapper;
    @Autowired
    UserService userService;

    @Override
    public VoteResponse addVote(Long pollId, Long choiceId) {
        Users authUser = userService.getAuthUser();
        Poll poll = isCheckPoll(pollId);
        Optional<Vote> entity = voteRepos.findByOwnerAndPoll(authUser.getId(), pollId);
        if(entity.isPresent()) {
            throw new EntityexistingException("the authUser already voted for the poll, cannot vote twice");
        }
        Choice choice = isCheckChoice(choiceId);
        Vote vote = new Vote(authUser, poll, choice);
        voteRepos.save(vote);
        vote.addYourVote(authUser, poll, choice);
        pollRepos.save(poll);
        usersRepos.save(authUser);
        VoteResponse response = voteMapper.mapVoteToResponse(vote);
        return response;
    }

    @Override
    public List<VoteResponse> getVotesByPoll(Long pollId) {
       List<Vote> votes = voteRepos.findByPoll(pollId);
       List<VoteResponse> responses = votes.stream().map(vote -> voteMapper.mapVoteToResponse(vote)).collect(Collectors.toList());
       return responses;
    }

    private Poll isCheckPoll(Long pollId) {
        Optional<Poll> entity = pollRepos.findById(pollId);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the poll not found");
        }
        return entity.get();
    }

    private Choice isCheckChoice(Long choiceId) {
        Optional<Choice> entity = ChoiceRepos.findById(choiceId);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the choice not found");
        }
        return entity.get();
    }

   
    
}
