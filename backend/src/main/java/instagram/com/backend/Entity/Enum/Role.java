package instagram.com.backend.Entity.Enum;

public enum Role {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private String name;

    Role(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
