package instagram.com.backend.Security;

import javax.security.auth.message.callback.PrivateKeyCallback.Request;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import instagram.com.backend.Security.Filter.FilterAuthentication;
import instagram.com.backend.Security.Filter.FilterException;
import instagram.com.backend.Security.Filter.FilterJwtAuthorization;
import instagram.com.backend.Service.UserService;
import instagram.com.backend.Service.ServiceImplement.UserServiceImp;
import lombok.AllArgsConstructor;


@AllArgsConstructor
@EnableWebSecurity
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    @Autowired
    CustomAuthenticationManager customAuthenticationManager;
    @Autowired
    UserServiceImp userServiceImp;
    @Autowired
    FilterException filterException;
    @Autowired
    LogoutSuccessHandler logoutSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        FilterAuthentication filterAuthentication = new FilterAuthentication(customAuthenticationManager, userServiceImp);
        filterAuthentication.setFilterProcessesUrl("/login");

        http.csrf().disable()
        .cors()
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests()
        .antMatchers(HttpMethod.GET, "/api/users/**").permitAll()
        .antMatchers(HttpMethod.POST, "/api/users/register").permitAll()
        .antMatchers(HttpMethod.GET, "/api/follow/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/posts/user/allPostOfActiveUser/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/posts/user/allPostBySearchContent/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/posts/user/allPostBytag/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/postlikes/getAllByPost/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/comments/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/commentLike/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/tags/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/stories/public/**").permitAll()
        .antMatchers(HttpMethod.GET, "/api/storyLikes/**").permitAll()
        .antMatchers("/api/images/**").permitAll()
        .anyRequest().authenticated()
        .and()
        .addFilterBefore(filterException, filterAuthentication.getClass())
        .addFilter(filterAuthentication)
        .addFilterAfter(new FilterJwtAuthorization(), filterAuthentication.getClass());

        http.logout().permitAll()
        .addLogoutHandler((request, response, auth) -> {
            SecurityContextHolder.getContext().setAuthentication(null);
            response.setHeader("Authorization", "");
        }).logoutSuccessHandler(logoutSuccessHandler);


        return http.build();
    }

 }
