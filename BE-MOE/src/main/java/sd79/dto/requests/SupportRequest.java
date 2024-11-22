package sd79.dto.requests;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SupportRequest {
    private Long customerId;
//    private String customerName;
//    private String phoneNumber;
    private String issueDescription;
//    private LocalDateTime createdDate;
}

