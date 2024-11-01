/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.exception;

import jakarta.persistence.EntityExistsException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
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

    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            HttpMessageNotReadableException.class,
            ConstraintViolationException.class,
            EntityExistsException.class,
            AccessDeniedException.class,
            InvalidDataException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponse handleValidException(Exception ex, WebRequest request) {
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setPath(request.getDescription(false).replace("uri=", ""));

        String message = ex.getMessage();
        switch (ex) {
            case MethodArgumentNotValidException methodArgumentNotValidException -> {
                int start = message.lastIndexOf("[");
                int end = message.lastIndexOf("]");
                message = message.substring(start + 1, end - 1);
                response.setError("Payload invalid");
            }
            case ConstraintViolationException constraintViolationException -> {
                message = message.substring(message.indexOf(" ") + 1);
                response.setError("PathVariable invalid");
            }
            case HttpMessageNotReadableException httpMessageNotReadableException -> {
                int startIndex = message.indexOf("JSON parse error: ");
                if (startIndex != -1) {
                    String detailedMessage = message.substring(startIndex + "JSON parse error: ".length());
                    int errorStart = detailedMessage.indexOf("Failed to parse Date value '");
                    int errorEnd = detailedMessage.indexOf("'", errorStart + "Failed to parse Date value '".length());
                    message = detailedMessage.substring(errorStart, errorEnd);
                    response.setError("Invalid payload format");

                }
            }
            case EntityExistsException entityExistsException -> response.setError("Entity exists");
            case AccessDeniedException accessDeniedException -> response.setError("Access denied");
            case InvalidDataException invalidDataException -> response.setError("Invalid data");
            default -> {
            }
        }
        response.setMessage(message);
        return response;
    }

    @ExceptionHandler({
            EntityNotFoundException.class,
            AuthenticationExceptionCustom.class
    })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionResponse handleEntityNotFound(Exception ex, WebRequest request) {
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setStatus(HttpStatus.NOT_FOUND.value());
        response.setPath(request.getDescription(false).replace("uri=", ""));
        String message = ex.getMessage();
        if (ex instanceof EntityNotFoundException) {
            response.setError("Entity not found");
        } else if (ex instanceof AuthenticationExceptionCustom) {
            response.setError("Authentication error");
            message = "Username or password incorrect";
        }
        response.setMessage(message);
        return response;
    }

    @ExceptionHandler({NotAllowedDeleteEntityException.class})
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    public ExceptionResponse handleEntityNotAccept(Exception ex, WebRequest request) {
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setStatus(HttpStatus.NOT_ACCEPTABLE.value());
        response.setPath(request.getDescription(false).replace("uri=", ""));
        String message = ex.getMessage();
        if (ex instanceof NotAllowedDeleteEntityException) {
            response.setError("Can't delete this entity");
        }
        response.setMessage(message);
        return response;
    }

    @ExceptionHandler({
            BadCredentialsException.class,
            AuthenticationException.class,
            InternalAuthenticationServiceException.class,
            DisabledException.class,
            LockedException.class,
    })
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ExceptionResponse handleBadCredentials(Exception ex, WebRequest request) {
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setPath(request.getDescription(false).replace("uri=", ""));
        String message = ex.getMessage();

        if (ex instanceof InternalAuthenticationServiceException) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setError("Bad credentials");
            message = "Tài khoản không tồn tại";
        } else if (ex instanceof BadCredentialsException) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setError("Bad credentials");
            message = "Mật khẩu không hợp lệ";
        } else if (ex instanceof DisabledException) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setError("Người dùng đã bị vô hiệu hóa");
        } else if (ex instanceof LockedException) {
            response.setStatus(HttpStatus.LOCKED.value());
            response.setError("Người dùng đã bị khóa");
        }
        response.setMessage(message);
        return response;
    }
}
