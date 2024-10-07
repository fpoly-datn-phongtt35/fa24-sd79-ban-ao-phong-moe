import axios from "axios"

export const fetchAllCountry = async () => {
    return await axios.get("https://restcountries.com/v3.1/all")
    .then((res) => {
        return res.data.map(country => country.name.common);
    });
}