package sd79.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.configuration.AddressConfig;

@RestController
@RequestMapping("/api/${api.version}/address")
public class AddressController {
    @Autowired
    private AddressConfig addressConfig;

    @GetMapping("/provinces")
    public ResponseEntity<String> getProvinces() {
        try {
            String provinces = addressConfig.getFilteredProvinces();
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving provinces: " + e.getMessage());
        }
    }
    @GetMapping("/districts/{provinceId}")
    public ResponseEntity<String> getDistricts(@PathVariable int provinceId) {
        try {
            String districts = addressConfig.getFilteredDistricts(provinceId);
            return ResponseEntity.ok(districts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving districts: " + e.getMessage());
        }
    }

    @GetMapping("/wards/{districtId}")
    public ResponseEntity<String> getWards(@PathVariable int districtId) {
        try {
            String wards = addressConfig.getFilteredWards(districtId);
            return ResponseEntity.ok(wards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving wards: " + e.getMessage());
        }
    }
}
