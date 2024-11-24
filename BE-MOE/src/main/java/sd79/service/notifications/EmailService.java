/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.notifications;

import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import sd79.dto.requests.notifications.EmailRequest;
import sd79.dto.requests.notifications.SendEmailRequest;
import sd79.dto.requests.notifications.Sender;
import sd79.exception.InvalidDataException;
import sd79.repositories.httpClient.EmailClient;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    EmailClient emailClient;

    @Value("${notification.email.brevo-apikey}")
    @NonFinal
    String apiKey;

    @KafkaListener(topics = "send-mail")
    public void sendEmail(SendEmailRequest request) {
        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .name("MOE SHOP")
                        .email("mobahoangvu2004@gmail.com")
                        .build())
                .to(request.getTo())
                .subject(request.getSubject())
                .htmlContent(request.getHtmlContent())
                .build();
        try {
            emailClient.sendEmail(apiKey, emailRequest);
        } catch (FeignException e) {
            throw new InvalidDataException("Something went wrong while sending email", e);
        }
    }
}
