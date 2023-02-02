package instagram.com.backend.Service.ServiceImplement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import instagram.com.backend.Entity.Tag;
import instagram.com.backend.Repository.TagRepos;
import instagram.com.backend.Service.TagService;

@Service
public class TagServiceImp implements TagService{
    @Autowired
    TagRepos tagRepos;

    @Override
    public List<Tag> getTagsByContentSearch(String content) {
       return tagRepos.findByContentContaining(content);
    }
    
    @Override
    public List<Tag> getAll() {
       return tagRepos.findAll(Sort.by("content").ascending());
    }
}
