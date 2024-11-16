package sd79.service;

import sd79.model.Support;

import java.util.List;

public interface SupportService {
    Support createSupportRequest(Long customerId, String issueDescription);
    List<Support> getSupportRequestsByStatus(String status);
    Support resolveSupportRequest(Long supportId);
}