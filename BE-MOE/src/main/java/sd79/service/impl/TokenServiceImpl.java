package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.exception.EntityNotFoundException;
import sd79.model.redis_model.Token;
import sd79.repositories.auth.TokenRepository;
import sd79.service.TokenService;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;

    @Override
    public void deleteToken(String id) {
        Token token = getToken(id);
        this.tokenRepository.delete(token);
    }

    @Override
    public void saveToken(Token token) {
        this.tokenRepository.save(token);
    }

    @Override
    public Token getToken(String id) {
        return this.tokenRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Something went wrong!"));
    }
}
