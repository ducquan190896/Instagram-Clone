package instagram.com.backend.Service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;



public interface ImageService {
    List<String> uploadImages(List<MultipartFile> files);
    byte[] getImageByFileName(String fileName);
}
