package instagram.com.backend.Validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ElementType.ANNOTATION_TYPE, ElementType.TYPE})
@Constraint(validatedBy = {FollowersValidator.class})
@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface IsFollowers {
    String message() default "followers are not valid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
} 
