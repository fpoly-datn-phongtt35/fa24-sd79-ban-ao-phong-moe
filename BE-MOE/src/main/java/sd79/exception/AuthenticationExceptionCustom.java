/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.exception;

public class AuthenticationExceptionCustom extends RuntimeException {
    public AuthenticationExceptionCustom(String message) {
        super(message);
    }

    public AuthenticationExceptionCustom(String message, Throwable cause) {
        super(message, cause);
    }
}

