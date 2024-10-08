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
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/${api.version}/auth")
@RequiredArgsConstructor
public class TestController {

    private final CloudinaryUpload cloudinaryUpload;

    @PostMapping("/test")
    public String test(@ModelAttribute FileUploadDto fileUploadDto) {

        String description = fileUploadDto.getDescription();
        String fileType = fileUploadDto.getFileType();

        log.info("url={}, description={}, type={}", cloudinaryUpload.upload(fileUploadDto.getFiles().get(0)), description, fileType  );
        return "Success";
    }

    class FileUploadDto {
        private List<MultipartFile> files; // Sử dụng List để chứa nhiều tệp
        private String description;
        private String fileType;

        // Getter và Setter
        public List<MultipartFile> getFiles() {
            return files;
        }

        public void setFiles(List<MultipartFile> files) {
            this.files = files;
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
