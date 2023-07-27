package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.CommentLike;
import instagram.com.backend.Entity.Response.CommentLikeResponse;

@Component
public class CommentLikeMapper {
    @Autowired
    UserMapper userMapper;
    
    public CommentLikeResponse mapCommentLikeToResponse(CommentLike commentLike) {
        CommentLikeResponse response = new CommentLikeResponse(commentLike.getId(), userMapper.mapUserToUserResponse(commentLike.getOwner()), commentLike.getPost().getId(), commentLike.getComment().getId(), commentLike.getDateCreated());
        return response;
    }
}
