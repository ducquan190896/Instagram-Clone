package instagram.com.backend.Validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import instagram.com.backend.Entity.Users;



public class FollowingsValidator implements ConstraintValidator<IsFollowings, Users> {
    @Override
    public boolean isValid(Users user, ConstraintValidatorContext context) {
        boolean isCheck = user.getFollowings().stream().allMatch(follow -> follow.getFollowing().getId() == user.getId());
        return isCheck;
    }
}
