package sd79.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sd79.controller.NotificationController;
import sd79.exception.EntityNotFoundException;
import sd79.model.Customer;
import sd79.model.Support;
import sd79.repositories.CustomerRepository;
import sd79.repositories.SupportRepository;
import sd79.service.SupportService;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class SupportServiceImpl implements SupportService {
    private final SupportRepository supportRepository;

    private final CustomerRepository customerRepository;
    private final NotificationController notificationController;

    @Autowired
    public SupportServiceImpl(SupportRepository supportRepository, CustomerRepository customerRepository, NotificationController notificationController) {
        this.supportRepository = supportRepository;
        this.customerRepository = customerRepository;
        this.notificationController = notificationController;
    }

    @Override
    public Support createSupportRequest(Long customerId, String issueDescription) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        Support support = new Support();
        support.setCustomer(customer);
        support.setIssueDescription(issueDescription);
        support.setStatus("Pending");
        support.setCreatedDate(LocalDateTime.now());

        Support savedSupport = supportRepository.save(support);

        // Gửi thông báo tới tất cả client về yêu cầu hỗ trợ mới
        notificationController.sendNotification("/topic/support", "New support request created");

        return savedSupport;
    }



    @Override
    public List<Support> getSupportRequestsByStatus(String status) {
        // Lấy danh sách yêu cầu hỗ trợ theo trạng thái
        return supportRepository.findByStatus(status);
    }

    @Override
    public Support resolveSupportRequest(Long supportId) {
        // Tìm yêu cầu hỗ trợ và đánh dấu là đã hoàn thành
        Support support = supportRepository.findById(supportId)
                .orElseThrow(() -> new EntityNotFoundException("Support request not found"));
        support.setStatus("Resolved");
        support.setResolvedDate(LocalDateTime.now());
        return supportRepository.save(support);
    }
}

