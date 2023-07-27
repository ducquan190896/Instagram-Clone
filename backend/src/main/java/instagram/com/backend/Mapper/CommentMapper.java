package instagram.com.backend.Mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import instagram.com.backend.Entity.Comment;
import instagram.com.backend.Entity.Response.CommentResponse;

@Component
public class CommentMapper {
    @Autowired
    UserMapper userMapper;  
    @Autowired
    PostMapper postMapper;
    
    public CommentResponse mapCommentToResponse(Comment comment) {
        CommentResponse commentResponse = new CommentResponse(comment.getId(), comment.getContent(), comment.getNestedCommentCount(), comment.getCommentLikeCount(), userMapper.mapUserToUserResponse(comment.getOwner()), postMapper.mapPostToResponse(comment.getPost()), comment.getDateCreated());
        if(comment.getParentComment() != null) {
            commentResponse.setParentCommentId(comment.getParentComment().getId());
        }
        return commentResponse;
    }
}
