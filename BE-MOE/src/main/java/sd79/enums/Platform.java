/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.enums;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public enum Platform {
    @JsonProperty("web")
    WEB,
    @JsonProperty("android")
    ANDROID,
    @JsonProperty("ios")
    IOS,
    @JsonProperty("miniApp")
    MINI_APP
}