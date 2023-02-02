package instagram.com.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import instagram.com.backend.Entity.Tag;
import  instagram.com.backend.Service.TagService;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
   TagService TagService;

    @GetMapping("/all")
    public ResponseEntity<List<Tag>> getAll() {
        return new ResponseEntity<List<Tag>>(TagService.getAll(), HttpStatus.OK);
    }
    @GetMapping("/searchingContent/{content}")
    public ResponseEntity<List<Tag>> getAllBySearchingContent(@PathVariable String content) {
        return new ResponseEntity<List<Tag>>(TagService.getTagsByContentSearch(content), HttpStatus.OK);
    }
}
