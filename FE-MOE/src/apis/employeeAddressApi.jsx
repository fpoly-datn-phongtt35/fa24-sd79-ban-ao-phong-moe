// // src/AddressSelector.js
// import React, { useEffect, useState } from 'react';
// import { getAllProvinces, getDistrictsByProvinceId, getWardsByDistrictId } from '~/apis/addressApi'; // Import các hàm API
// import { toast } from "react-toastify";

// const AddressSelector = ({ onAddressChange }) => {
//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [selectedProvince, setSelectedProvince] = useState('');
//   const [selectedDistrict, setSelectedDistrict] = useState('');
//   const [selectedWard, setSelectedWard] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProvinces = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const data = await getAllProvinces(); // Sử dụng hàm API
//         setProvinces(data);
//       } catch (error) {
//         console.error('Error fetching provinces:', error);
//         setError('Không thể tải tỉnh/thành phố. Vui lòng thử lại sau.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProvinces();
//   }, []);

//   const handleProvinceChange = async (event) => {
//     const provinceId = event.target.value;
//     setSelectedProvince(provinceId);
//     setSelectedDistrict(''); // Reset district and ward when province changes
//     setWards([]); // Reset wards when province changes

//     if (provinceId) {
//       setLoading(true);
//       try {
//         const data = await getDistrictsByProvinceId(provinceId); // Sử dụng hàm API
//         setDistricts(data);
//       } catch (error) {
//         console.error('Error fetching districts:', error);
//         setError('Không thể tải quận/huyện. Vui lòng thử lại sau.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleDistrictChange = async (event) => {
//     const districtId = event.target.value;
//     setSelectedDistrict(districtId);
//     setWards([]); // Reset wards when district changes

//     if (districtId) {
//       setLoading(true);
//       try {
//         const data = await getWardsByDistrictId(districtId); // Sử dụng hàm API
//         setWards(data);
//       } catch (error) {
//         console.error('Error fetching wards:', error);
//         setError('Không thể tải xã/phường. Vui lòng thử lại sau.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleWardChange = (event) => {
//     const wardId = event.target.value;
//     setSelectedWard(wardId);
//   };

//   useEffect(() => {
//     // Call the onAddressChange prop whenever the address changes
//     onAddressChange(selectedProvince, selectedDistrict, selectedWard);
//   }, [selectedProvince, selectedDistrict, selectedWard, onAddressChange]);

//   return (
//     <div>
//       <h1>Chọn Địa Chỉ</h1>

//       {loading && <p>Đang tải dữ liệu...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <div>
//         <label>Tỉnh/Thành Phố:</label>
//         <select value={selectedProvince} onChange={handleProvinceChange}>
//           <option value="">Chọn Tỉnh/Thành Phố</option>
//           {provinces.map((province) => (
//             <option key={province.ProvinceID} value={province.ProvinceID}>
//               {province.ProvinceName}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Quận/Huyện:</label>
//         <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
//           <option value="">Chọn Quận/Huyện</option>
//           {districts.map((district) => (
//             <option key={district.DistrictID} value={district.DistrictID}>
//               {district.DistrictName}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Xã/Phường:</label>
//         <select value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict}>
//           <option value="">Chọn Xã/Phường</option>
//           {wards.map((ward) => (
//             <option key={ward.WardCode} value={ward.WardCode}>
//               {ward.WardName}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default AddressSelector;
