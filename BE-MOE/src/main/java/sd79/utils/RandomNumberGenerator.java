/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.utils;

import java.util.Random;

public class RandomNumberGenerator {

    public static String generateEightDigitRandomNumber() {
        Random random = new Random();
        int number = random.nextInt(100000000);
        return String.format("%08d", number);
    }
}

