package instagram.com.backend.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "image")
@Entity(name = "Image")
public class Image {
    @Id
    @SequenceGenerator(
        name = "image_sequence",
        sequenceName = "image_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "image_sequence"
    )
    @Column(name = "id", updatable = false)
    private Long id;

    @NotBlank(message = "fileName of image cannot be blank")
    @Column(name = "file_name", nullable = false, unique = true)
    private String fileName;

    @NotBlank(message = "type of image cannot be blank")
    @Column(name = "type", nullable = false)
    private String type;


    @Column(name = "data_byte", nullable = false)
    private byte[] dataByte;


    public Image( String fileName, String type, byte[] dataByte) {
        this.fileName = fileName;
        this.type = type;
        this.dataByte = dataByte;
    }


    
}
