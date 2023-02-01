package instagram.com.backend.Security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;


@Component
public class LogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler{
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        System.out.println("logout successfully");
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        response.getWriter().write("logout successfully");
        response.getWriter().flush();
    }
}
