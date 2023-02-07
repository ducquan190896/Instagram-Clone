package instagram.com.backend.Utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

import org.springframework.stereotype.Component;

import instagram.com.backend.Exception.BadResultException;

@Component
public class ImageUtils {
    
    public byte[] compressImage(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.setLevel(deflater.BEST_COMPRESSION);
        deflater.finish();

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] tmp = new byte[4 * 1024];

        try {
            while(!deflater.finished()) {
                int count = deflater.deflate(tmp);
                byteArrayOutputStream.write(tmp, 0, count);
            }
        byteArrayOutputStream.close();

        } catch (IOException ex) {
            throw new BadResultException(ex.getMessage());
        }

        return byteArrayOutputStream.toByteArray();

    }

    public byte[] decompressImage(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] tmp = new byte[4 * 1024];

        try {
            while(!inflater.finished()) {
                int count = inflater.inflate(tmp);
                byteArrayOutputStream.write(tmp, 0, count);
            }
            byteArrayOutputStream.close();

        } catch (Exception ex) {
            throw new BadResultException(ex.getMessage());
        }

        return byteArrayOutputStream.toByteArray();

    }
}
