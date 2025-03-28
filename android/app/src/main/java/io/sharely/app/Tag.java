package io.sharely.app;

public class Tag {
    private String id;
    private String name;
    private String userId;

    public Tag(String id, String name, String userId) {
        this.id = id;
        this.name = name;
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUserId() {
        return userId;
    }
}
