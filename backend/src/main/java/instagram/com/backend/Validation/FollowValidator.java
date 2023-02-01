package instagram.com.backend.Validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import instagram.com.backend.Entity.Follow;

public class FollowValidator implements ConstraintValidator<IsFollow, Follow>  {

    @Override
    public boolean isValid(Follow follow, ConstraintValidatorContext context) {
        if(follow.getFollower().getId() != follow.getFollowing().getId()) {
            return true;
        }
        return false;
    }
    
}
