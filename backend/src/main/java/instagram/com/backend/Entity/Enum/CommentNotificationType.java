package instagram.com.backend.Entity.Enum;

public enum CommentNotificationType {
    COMMENT_LIKE("COMMENT_LIKE"),
    ADD_COMMENT_TO_PARENT_COMMENT("ADD_COMMENT_TO_PARENT_COMMENT");

    private String name;

    CommentNotificationType(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
