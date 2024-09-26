package sd79.service;

import sd79.model.redis_model.Token;

public interface TokenService {

    void deleteToken(String id);

    void saveToken(Token token);

    Token getToken(String id);
}
