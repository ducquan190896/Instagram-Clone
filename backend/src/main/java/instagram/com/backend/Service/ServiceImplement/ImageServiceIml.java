package instagram.com.backend.Service.ServiceImplement;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import instagram.com.backend.Entity.Image;
import instagram.com.backend.Exception.BadResultException;
import instagram.com.backend.Repository.ImageRepos;
import instagram.com.backend.Service.ImageService;
import instagram.com.backend.Utils.ImageUtils;

@Service
public class ImageServiceIml implements ImageService {

    @Autowired
    ImageRepos imageRepos;
    @Autowired
    ImageUtils imageUtils;

    @Override
    public byte[] getImageByFileName(String fileName) {
        
        Optional<Image> entity = imageRepos.findByFileName("/api/images/image/" + fileName);
        if(!entity.isPresent()) {
            throw new EntityNotFoundException("the image not found");
        }
        byte[] output = imageUtils.decompressImage(entity.get().getDataByte());
        return output;
    }

    @Override
    public List<String> uploadImages(List<MultipartFile> files) {
        
        List<String> stringImages = new ArrayList<>();
        UUID uuid = UUID.randomUUID();

        files.stream().forEach(file -> {
            try {
            String fileName = "/api/images/image/" + file.getOriginalFilename();
            Optional<Image> entity = imageRepos.findByFileName(fileName);
            if(entity.isPresent()) {
                fileName = fileName + uuid.toString();
            }

            String type = file.getContentType();
            byte[] compresseByte = imageUtils.compressImage(file.getBytes());
            Image image = new Image(fileName, type, compresseByte);
            stringImages.add( fileName);
            imageRepos.save( image);
            } catch (IOException ex) {
                throw new BadResultException(ex.getMessage());
            }

        });
        return stringImages;

    }
    
}
