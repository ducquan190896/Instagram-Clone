package instagram.com.backend;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import instagram.com.backend.Entity.Chat;
import instagram.com.backend.Entity.ChatParticipant;
import instagram.com.backend.Entity.Choice;
import instagram.com.backend.Entity.Message;
import instagram.com.backend.Entity.Poll;
import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.PostLike;
import instagram.com.backend.Entity.Story;
import instagram.com.backend.Entity.Tag;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Vote;
import instagram.com.backend.Entity.Enum.PostNotificationType;
import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Repository.ChatParticipantRepos;
import instagram.com.backend.Repository.ChatRepos;
import instagram.com.backend.Repository.ChoiceRepos;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.MessageRepos;
import instagram.com.backend.Repository.PollRepos;
import instagram.com.backend.Repository.PostLikeRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.StoryRepos;
import instagram.com.backend.Repository.TagRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Repository.VoteRepos;
import instagram.com.backend.Service.FollowService;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(UsersRepos usersRepos, FollowRepos followRepos, FollowService followService, PostRepos postRepos, PostLikeRepos postLikeRepos, TagRepos tagRepos, StoryRepos storyRepost, PollRepos pollRepos, ChoiceRepos choiceRepos, VoteRepos voteRepos, ChatRepos chatRepos, MessageRepos messageRepose, ChatParticipantRepos ChatParticipantRepos ) {
		return args -> {
			Users admin = new Users("admin", "admin@gmail.com", new BCryptPasswordEncoder().encode("123456"), "admin manages the application", Role.ADMIN);
			Users quan = new Users("quan", "quan@gmail.com",  new BCryptPasswordEncoder().encode("123456"), "quan manages the application", Role.USER);
			Users quan2 = new Users("quan2", "quan2@gmail.com",  new BCryptPasswordEncoder().encode("123456"), "quan2 manages the application", Role.USER);
			Users quan3 = new Users("quan3", "quan3@gmail.com",  new BCryptPasswordEncoder().encode("123456"), "quan2 manages the application", Role.USER);
			usersRepos.save(admin);
			usersRepos.save(quan);
			usersRepos.save(quan2);
			usersRepos.save(quan3);
			// followService.followUser(quan, quan2);

			Tag tag1 = new Tag("helsinki");
			tagRepos.save(tag1);

			Post post1 = new Post("hello instagram", quan);
			postRepos.save(post1);


			Post post2 = new Post("hello instagram 2", quan2);
			tag1.addTagToPost(post2);
			
			postRepos.save(post2);
			tagRepos.save(tag1);

			// Post post3 = new Post("hello instagram 2", quan3);
			// postRepos.save(post3);

			// Post post5 = new Post("hello instagram 5", quan);
			// postRepos.save(post5);

			// // quan3.setActive(false);
			// // usersRepos.save(quan3);

			// List<String> listImages = Arrays.asList("lkajsdf.png", "dlkajfdlklkjlk.png" );
			// List<String> listImages2 = Arrays.asList("lkajsdfasdf.png", "dlkajfdlklkjlfsadffffffk.png" );

			// // Story story1 = new Story(listImages, quan);
			// // storyRepost.save(story1);
			
			// // Story story2 = new Story(listImages2, quan);
			// // storyRepost.save(story2);

			
			// Poll poll1 = new Poll("which programming language is better", 2);
			// Post post4 = new Post("polling for language", quan, poll1);
			// poll1.setPost(post4);
			// Choice choice1 = new Choice("java");
			// Choice choice2 = new Choice("c#");
			// Choice choice3 = new Choice("PHP");
			// poll1.addChoiceToPost(choice1);
			// poll1.addChoiceToPost(choice2);
			// poll1.addChoiceToPost(choice3);
			// postRepos.save(post4);


			// Poll poll2 = new Poll("which framework is better", 2);
			// Post post6 = new Post("polling for language", quan, poll2);
			// poll2.setPost(post6);
			// Choice choice4 = new Choice("spring");
			// Choice choice5 = new Choice("asp.net");
			// Choice choice6 = new Choice("dijango");
			// poll2.addChoiceToPost(choice4);
			// poll2.addChoiceToPost(choice5);
			// poll2.addChoiceToPost(choice6);
			// postRepos.save(post6);

			// System.out.println(poll1);

			// Vote vote1 = new Vote(quan3, poll1, choice1);
			// voteRepos.save(vote1);
			// vote1.addYourVote(quan3, poll1, choice1);
			// pollRepos.save(poll1);
			// usersRepos.save(quan3);


			// //create chat and chatParticipants
			// Chat chat1 = new Chat();
			// ChatParticipant participant1 = new ChatParticipant(quan);
			// ChatParticipant participant2 = new ChatParticipant(quan2);
			// quan.getParticipants().add(participant1);
			// quan2.getParticipants().add(participant2);

			// participant1.addParticipantToChat(chat1);
			// participant2.addParticipantToChat(chat1);
			// chatRepos.save(chat1);
			// usersRepos.save(quan);
			// usersRepos.save(quan2);


			// Message message = new Message("hi", chat1, participant2);
			// message.addMessageToChat(chat1, participant2);
			// chatRepos.save(chat1);

			
			// List<Chat> chats = chatRepos.findByUserId(quan.getId());
			// chats.stream().forEach(ch -> System.out.println(ch));

			// List<Chat> chats = chatRepos.findByUsers(quan.getId(), quan2.getId());
			// chats.stream().forEach(ch -> System.out.println(ch));

			// create messages for chat



			// PostLike like1 = new PostLike(quan2, post1);
			// postLikeRepos.save(like1);
			// quan2.getPostLikes().add(like1);
			// usersRepos.save(quan2);
			// PostNotification notification1 = new PostNotification(PostNotificationType.POST_LIKE, quan2, post1.getOwner(), post1);
			// postNotificationRepos.save(notification1);

		};
	}

}
