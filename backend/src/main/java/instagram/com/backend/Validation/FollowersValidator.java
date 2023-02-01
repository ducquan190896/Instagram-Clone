package instagram.com.backend.Validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import instagram.com.backend.Entity.Users;

public class FollowersValidator implements ConstraintValidator<IsFollowers, Users> {

    @Override
    public boolean isValid(Users user, ConstraintValidatorContext context) {
        boolean isCheck = user.getFollowers().stream().allMatch(follow -> follow.getFollower().getId() == user.getId());
       
       return isCheck;
    }
    
}
