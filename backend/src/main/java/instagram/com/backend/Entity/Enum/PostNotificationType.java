package instagram.com.backend.Entity.Enum;

public enum PostNotificationType {
    POST_LIKE("POST_Like"),
    POST_COMMENT("POST_COMMENT");

    private String name;

    PostNotificationType(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

}
