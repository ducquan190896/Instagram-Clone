package instagram.com.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import instagram.com.backend.Entity.Post;
import instagram.com.backend.Entity.PostLike;
import instagram.com.backend.Entity.PostNotification;
import instagram.com.backend.Entity.Users;
import instagram.com.backend.Entity.Enum.PostNotificationType;
import instagram.com.backend.Entity.Enum.Role;
import instagram.com.backend.Repository.FollowRepos;
import instagram.com.backend.Repository.PostLikeRepos;
import instagram.com.backend.Repository.PostNotificationRepos;
import instagram.com.backend.Repository.PostRepos;
import instagram.com.backend.Repository.UsersRepos;
import instagram.com.backend.Service.FollowService;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(UsersRepos usersRepos, FollowRepos followRepos, FollowService followService, PostRepos postRepos, PostLikeRepos postLikeRepos, PostNotificationRepos postNotificationRepos) {
		return args -> {
			Users admin = new Users("admin", "admin@gmail.com", new BCryptPasswordEncoder().encode("123456"), "admin manages the application", Role.ADMIN);
			Users quan = new Users("quan", "quan@gmail.com",  new BCryptPasswordEncoder().encode("123456"), "quan manages the application", Role.USER);
			Users quan2 = new Users("quan2", "quan2@gmail.com",  new BCryptPasswordEncoder().encode("123456"), "quan2 manages the application", Role.USER);
			usersRepos.save(admin);
			usersRepos.save(quan);
			usersRepos.save(quan2);

			// followService.followUser(quan, quan2);

			Post post1 = new Post("hello instagram", quan);
			postRepos.save(post1);
			
			// PostLike like1 = new PostLike(quan2, post1);
			// postLikeRepos.save(like1);
			// quan2.getPostLikes().add(like1);
			// usersRepos.save(quan2);
			// PostNotification notification1 = new PostNotification(PostNotificationType.POST_LIKE, quan2, post1.getOwner(), post1);
			// postNotificationRepos.save(notification1);

		};
	}

}
