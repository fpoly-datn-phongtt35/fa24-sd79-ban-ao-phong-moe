//package sd79.service.impl;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//import sd79.model.Support;
//import sd79.service.NotificationService;
//
//@Service
//public class NotificationServiceImpl implements NotificationService {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    @Autowired
//    public NotificationServiceImpl(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    @Override
//    public void notifyEmployee(Support support) {
//        String notificationMessage = "New support request from customer ID: " + support.getCustomer().getId();
//        messagingTemplate.convertAndSend("/topic/notifications", notificationMessage);
//    }
//}
