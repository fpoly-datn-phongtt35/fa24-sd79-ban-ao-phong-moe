package sd79.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Định nghĩa broker để gửi tin nhắn tới client
        config.setApplicationDestinationPrefixes("/app"); // Tiền tố của các endpoint xử lý từ client gửi lên server
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Định nghĩa endpoint để client kết nối
                .setAllowedOrigins("*") // Cho phép mọi nguồn gốc kết nối (có thể giới hạn lại để tăng bảo mật)
                .withSockJS(); // Hỗ trợ fallback qua SockJS nếu WebSocket không được hỗ trợ
    }
}


