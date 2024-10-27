import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/joy";

const host = "https://provinces.open-api.vn/api/";

const LocationSelector = () => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      const response = await axios.get(`${host}?depth=1`);
      setCities(response.data);
    };
    fetchCities();
  }, []);

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedDistrict("");
    setSelectedWard("");
    if (cityId) {
      const response = await axios.get(`${host}p/${cityId}?depth=2`);
      setDistricts(response.data.districts);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard(""); // Reset ward
    if (districtId) {
      const response = await axios.get(`${host}d/${districtId}?depth=2`);
      setWards(response.data.wards);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCity && selectedDistrict && selectedWard) {
      const cityName =
        cities.find((city) => city.code == selectedCity)?.name ||
        "Unknown City";
      const districtName =
        districts.find((district) => district.code == selectedDistrict)?.name ||
        "Unknown District";
      const wardName =
        wards.find((ward) => ward.name == selectedWard)?.name || "Unknown Ward";

      console.log(
        `Selected Location: ${cityName} | ${districtName} | ${wardName}`
      );
    } else {
      console.log("Please select a city, district, and ward.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <select id="city" value={selectedCity} onChange={handleCityChange}>
          <option value="" disabled>
            Chọn tỉnh thành
          </option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
        >
          <option value="" disabled>
            Chọn quận huyện
          </option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>

        <select id="ward" value={selectedWard} onChange={handleWardChange}>
          <option value="" disabled>
            Chọn phường xã
          </option>
          {wards.map((ward) => (
            <option key={ward.name} value={ward.name}>
              {ward.name}
            </option>
          ))}
        </select>

        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default LocationSelector;
