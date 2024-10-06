package sd79.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import sd79.configuration.CloudinaryConfig;
import sd79.utils.CloudinaryUpload;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/${api.version}/auth")
@RequiredArgsConstructor
public class TestController {

    private final CloudinaryUpload cloudinaryUpload;

    @PostMapping("/test")
    public String test(@ModelAttribute FileUploadDto fileUploadDto) {
        MultipartFile file = fileUploadDto.getFile();
        String description = fileUploadDto.getDescription();
        String fileType = fileUploadDto.getFileType();

        return cloudinaryUpload.upload(fileUploadDto.getFile());
    }

    class FileUploadDto {
        private MultipartFile file;
        private String description;
        private String fileType;

        // Getter và Setter
        public MultipartFile getFile() {
            return file;
        }

        public void setFile(MultipartFile file) {
            this.file = file;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getFileType() {
            return fileType;
        }

        public void setFileType(String fileType) {
            this.fileType = fileType;
        }
    }
}
