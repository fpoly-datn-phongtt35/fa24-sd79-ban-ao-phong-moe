package sd79.utils;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import sd79.exception.CloudinaryException;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class CloudinaryUpload {

    private final Cloudinary cloudinary;

    public String upload(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            log.info("Upload successfully data={}", uploadResult.toString());
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            log.error("Upload failed message={}", e.getMessage());
            throw new CloudinaryException(e.getMessage());
        }
    }
}
