package sd79.configuration;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class AddressConfig {
    @Autowired
    private RestTemplate restTemplate;

    private static final String GHN_API_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
    private static final String API_TOKEN = "d29e5ada-8d2e-11ef-90e6-f21a21c01a2d";

    public String getFilteredProvinces() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", API_TOKEN);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(GHN_API_URL, HttpMethod.GET, entity, String.class);

        JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
        JsonArray provinces = jsonResponse.getAsJsonArray("data");
        JsonArray filteredProvinces = new JsonArray();

        for (var province : provinces) {
            JsonObject filteredProvince = new JsonObject();
            filteredProvince.addProperty("ProvinceID", province.getAsJsonObject().get("ProvinceID").getAsInt());
            filteredProvince.addProperty("ProvinceName", province.getAsJsonObject().get("ProvinceName").getAsString());
            filteredProvince.addProperty("CountryID", province.getAsJsonObject().get("CountryID").getAsInt());
            filteredProvince.addProperty("Code", province.getAsJsonObject().get("Code").getAsString());
            filteredProvinces.add(filteredProvince);
        }

        return filteredProvinces.toString();
    }
    public String getFilteredDistricts(int provinceId) {
        String url = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", API_TOKEN);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("province_id", provinceId);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        // Parse the JSON response using Gson
        JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
        JsonArray districts = jsonResponse.getAsJsonArray("data");
        JsonArray filteredDistricts = new JsonArray();

        for (var district : districts) {
            JsonObject filteredDistrict = new JsonObject();
            filteredDistrict.addProperty("DistrictID", district.getAsJsonObject().get("DistrictID").getAsInt());
            filteredDistrict.addProperty("ProvinceID", district.getAsJsonObject().get("ProvinceID").getAsInt());
            filteredDistrict.addProperty("DistrictName", district.getAsJsonObject().get("DistrictName").getAsString());
            filteredDistrict.addProperty("Code", district.getAsJsonObject().get("Code").getAsString());
            filteredDistricts.add(filteredDistrict);
        }

        return filteredDistricts.toString();
    }
    public String getFilteredWards(int districtId) {
        String url = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", API_TOKEN);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("district_id", districtId); // thêm district_id vào query

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        // Parse the JSON response using Gson
        JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
        JsonArray wards = jsonResponse.getAsJsonArray("data");
        JsonArray filteredWards = new JsonArray();

        for (var ward : wards) {
            JsonObject filteredWard = new JsonObject();
            filteredWard.addProperty("WardCode", ward.getAsJsonObject().get("WardCode").getAsString());
            filteredWard.addProperty("DistrictID", ward.getAsJsonObject().get("DistrictID").getAsInt());
            filteredWard.addProperty("WardName", ward.getAsJsonObject().get("WardName").getAsString());
            filteredWards.add(filteredWard);
        }

        return filteredWards.toString();
    }


}
