package instagram.com.backend.Validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ElementType.ANNOTATION_TYPE, ElementType.TYPE})
@Constraint(validatedBy = {FollowValidator.class})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface IsFollow {
    
    String message() default "the follow is not valid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
