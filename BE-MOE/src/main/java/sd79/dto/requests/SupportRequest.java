package sd79.dto.requests;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SupportRequest {
    private String hoTen;
    private String email;
    private String sdt;
    private String issueDescription;
    private LocalDateTime createdDate;
}

