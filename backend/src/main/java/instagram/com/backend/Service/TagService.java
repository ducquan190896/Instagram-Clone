package instagram.com.backend.Service;

import java.util.List;

import instagram.com.backend.Entity.Tag;

public interface TagService {
    List<Tag> getTagsByContentSearch(String content);
    List<Tag> getAll();
}
