package sd79.exception;

import jakarta.persistence.EntityExistsException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import sd79.dto.response.ExceptionResponse;

import java.util.Date;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class, ConstraintViolationException.class, EntityExistsException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponse handleValidException(Exception ex, WebRequest request) {
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setPath(request.getDescription(false).replace("uri=", ""));

        String message = ex.getMessage();
        if (ex instanceof MethodArgumentNotValidException) {
            int start = message.lastIndexOf("[");
            int end = message.lastIndexOf("]");
            message = message.substring(start + 1, end - 1);
            response.setError("Payload invalid");
        } else if (ex instanceof ConstraintViolationException) {
            message = message.substring(message.indexOf(" ") + 1);
            response.setError("PathVariable invalid");
        } else if (ex instanceof HttpMessageNotReadableException) {
            int startIndex = message.indexOf("JSON parse error: ");
            if (startIndex != -1) {
                String detailedMessage = message.substring(startIndex + "JSON parse error: ".length());
                int errorStart = detailedMessage.indexOf("Failed to parse Date value '");
                int errorEnd = detailedMessage.indexOf("'", errorStart + "Failed to parse Date value '".length());
                message = detailedMessage.substring(errorStart, errorEnd);
                response.setError("Invalid payload format");

            }
        }else if(ex instanceof EntityExistsException){
            response.setError("Entity exists");
        }
        response.setMessage(message);
        return response;
    }

    @ExceptionHandler({EntityNotFoundException.class, InternalAuthenticationServiceException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionResponse handleEntityNotFound(Exception ex, WebRequest request) {
        log.info("============== handleEntityNotFound ==============");
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setStatus(HttpStatus.NOT_FOUND.value());
        response.setPath(request.getDescription(false).replace("uri=", ""));
        String message = ex.getMessage();
        if (ex instanceof EntityNotFoundException) {
            response.setError("Entity not found");
        }if(ex instanceof InternalAuthenticationServiceException) {
            response.setError("Internal authentication service error");
            message = "Username or password incorrect";
        }
        response.setMessage(message);
        return response;
    }
}
