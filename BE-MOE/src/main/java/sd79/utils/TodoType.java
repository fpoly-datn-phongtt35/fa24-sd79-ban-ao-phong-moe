package sd79.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TodoType {
    @JsonProperty("public")
    PUBLIC,

    @JsonProperty("personal")
    PERSONAL,
}
