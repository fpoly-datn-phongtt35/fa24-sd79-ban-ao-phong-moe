//package sd79.service.impl;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import sd79.dto.response.CustomerResponse;
//import sd79.model.Customer;
//import sd79.model.CustomerAddress;
//import sd79.model.Support;
//import sd79.repositories.SupportRepository;
//import sd79.service.CustomerService;
//import sd79.service.NotificationService;
//import sd79.service.SupportService;
//
//
//import java.time.LocalDateTime;
//
//@Service
//public class SupportServiceImpl implements SupportService {
//
//    private final SupportRepository supportRepository;
//    private final CustomerService customerService;
//    private final NotificationService notificationService;
//
//    @Autowired
//    public SupportServiceImpl(SupportRepository supportRepository,
//                              CustomerService customerService,
//                              NotificationService notificationService) {
//        this.supportRepository = supportRepository;
//        this.customerService = customerService;
//        this.notificationService = notificationService;
//    }
//
//    @Override
//    public Support createSupportTicket(Long customerId, String issueDescription) {
//        // Lấy CustomerResponse từ CustomerService
//        CustomerResponse customerResponse = customerService.getCustomerById(customerId);
//
//        // Chuyển đổi từ CustomerResponse thành Customer
//        Customer customer = convertCustomerResponseToCustomer(customerResponse);
//
//        Support support = new Support();
//        support.setCustomer(customer);
//        support.setIssueDescription(issueDescription);
//        support.setStatus("Pending");
//
//
//        Support newSupport = supportRepository.save(support);
//
//        // Thông báo cho nhân viên
//        notificationService.notifyEmployee(newSupport);
//
//        return newSupport;
//    }
//
//    // Phương thức chuyển đổi từ CustomerResponse thành Customer
//    private Customer convertCustomerResponseToCustomer(CustomerResponse customerResponse) {
//        Customer customer = new Customer();
//        customer.setId(customerResponse.getId());
//        customer.setFirstName(customerResponse.getFirstName());
//        customer.setLastName(customerResponse.getLastName());
//        customer.setPhoneNumber(customerResponse.getPhoneNumber());
//        customer.setCreatedAt(customerResponse.getCreatedAt());
//        customer.setUpdatedAt(customerResponse.getUpdatedAt());
//
//        return customer;
//    }
//}
//
