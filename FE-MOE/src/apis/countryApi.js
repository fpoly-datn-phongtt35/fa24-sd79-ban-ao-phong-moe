// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import axios from "axios"

export const fetchAllCountry = async () => {
    return await axios.get("https://restcountries.com/v3.1/all")
    .then((res) => {
        return res.data.map(country => country.name.common);
    });
}