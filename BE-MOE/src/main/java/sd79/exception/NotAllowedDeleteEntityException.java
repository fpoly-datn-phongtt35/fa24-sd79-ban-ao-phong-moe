package sd79.exception;

public class NotAllowedDeleteEntityException extends RuntimeException {
    public NotAllowedDeleteEntityException(String message) {
        super(message);
    }

    public NotAllowedDeleteEntityException(String message, Throwable cause) {
        super(message, cause);
    }
}

