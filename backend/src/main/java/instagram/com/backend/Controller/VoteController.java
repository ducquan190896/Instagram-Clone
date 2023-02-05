package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Response.VoteResponse;
import instagram.com.backend.Service.VoteService;

@RestController
@RequestMapping("/api/votes")
public class VoteController {
    @Autowired
    VoteService voteService;

    @GetMapping("/poll/{pollId}")
    public ResponseEntity<List<VoteResponse>> getVotesByPoll(@PathVariable Long pollId) {
        return new ResponseEntity<List<VoteResponse>>(voteService.getVotesByPoll(pollId), HttpStatus.OK);
    }

    @PostMapping("/addVote/poll/{pollId}/choice/{choiceId}")
    public ResponseEntity<VoteResponse> addVote(@PathVariable Long pollId, @PathVariable Long choiceId) {
        return new ResponseEntity<VoteResponse>(voteService.addVote(pollId, choiceId), HttpStatus.CREATED);
    }
}
