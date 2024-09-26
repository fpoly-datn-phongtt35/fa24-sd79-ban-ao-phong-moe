package sd79.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TodoType {
    @JsonProperty("public")
    PUBLIC,

    @JsonProperty("personal")
    PERSONAL,
}
