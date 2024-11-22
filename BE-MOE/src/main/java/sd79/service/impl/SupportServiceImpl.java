package sd79.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import sd79.controller.NotificationController;
import sd79.exception.EntityNotFoundException;
import sd79.model.Customer;
import sd79.model.Support;
import sd79.model.User;
import sd79.repositories.CustomerRepository;
import sd79.repositories.SupportRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.SupportService;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class SupportServiceImpl implements SupportService {
    private final SupportRepository supportRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate; // Để gửi thông báo WebSocket

    @Autowired
    public SupportServiceImpl(SupportRepository supportRepository, CustomerRepository customerRepository,
                              SimpMessagingTemplate messagingTemplate, UserRepository userRepository) {
        this.supportRepository = supportRepository;
        this.customerRepository = customerRepository;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    @Override
    public List<Support> getAllSupportRequests() {
        return supportRepository.findAll(); // Lấy tất cả các yêu cầu hỗ trợ
    }

    @Override
    public Support createSupportRequest(Long userId, String issueDescription) {
        // Logic tạo yêu cầu hỗ trợ
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found for user"));

        Support support = new Support();
        support.setCustomerId(customer.getId());
        support.setIssueDescription(issueDescription);
        support.setStatus("Đang chờ xử lý");
        support.setCreatedDate(LocalDateTime.now());

        Support savedSupport = supportRepository.save(support);

        // Gửi thông báo cho tất cả nhân viên
        messagingTemplate.convertAndSend("/topic/support", "Có yêu cầu hỗ trợ mới");

        return savedSupport;
    }

    @Override
    public List<Support> getSupportRequestsByStatus(String status) {
        return List.of();
    }

    @Override
    public Support resolveSupportRequest(Long supportId) {
        return null;
    }
}


