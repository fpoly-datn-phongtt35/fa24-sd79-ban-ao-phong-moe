/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service;

import sd79.model.redis_model.Token;

public interface TokenService {

    void deleteToken(String id);

    void saveToken(Token token);

    Token getToken(String id);
}
