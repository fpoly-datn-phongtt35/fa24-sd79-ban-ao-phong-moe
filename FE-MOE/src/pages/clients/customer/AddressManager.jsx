import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Sheet, Typography, Input, Button, Grid, Select, Option, FormControl, FormLabel, Breadcrumbs, Link, Box, Radio, RadioGroup, Avatar } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import { toast } from 'react-toastify';
import { fetchAddressInfoById, putAddressInfo } from '~/apis/client/apiAccountManager';
import axios from 'axios';

const host = "https://provinces.open-api.vn/api/";

export const AddressInfo = () => {

    const [addressData, setAddressData] = useState({
        firstName: '',
        lastName: '',
        fullName: '',
        city: '',
        district: '',
        ward: '',
        streetName: '',
    });

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();




    const formatDate = (dateString, time = "00:00:00") => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year} | ${time}`;
    };

    const formatDate2 = (dateTimeString) => {
        const [datePart] = dateTimeString.split(' ');
        const [year, month, day] = datePart.split('-');
        return `${year}-${month}-${day}`;
    };



    useEffect(() => {
        const fetchCities = async () => {
            const response = await axios.get(`${host}?depth=1`);
            setCities(response.data);
        };
        fetchCities();
    }, []);

    const handleCityChange = async (e) => {
        const cityId = e;
        setSelectedCity(cityId);
        setSelectedDistrict("");
        setSelectedWard("");
        if (cityId) {
            const response = await axios.get(`${host}p/${cityId}?depth=2`);
            setDistricts(response.data.districts);
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e;
        setSelectedDistrict(districtId);
        setSelectedWard("");
        if (districtId) {
            const response = await axios.get(`${host}d/${districtId}?depth=2`);
            setWards(response.data.wards);
        } else {
            setWards([]);
        }
    };

    const handleWardChange = (e) => {
        setSelectedWard(e);
    };


    useEffect(() => {

        const fetchAddressDetail = async () => {
            try {
                const response = await fetchAddressInfoById(localStorage.getItem("userId"));
                const addressData = response.data;

                await handleCityChange(addressData.city_id);
                await handleDistrictChange(addressData.district_id);
                setAddressData({
                    firstName: addressData.firstName,
                    lastName: addressData.lastName,
                    fullName: addressData.fullName,
                    city: addressData.city,
                    district: addressData.district,
                    ward: addressData.ward,
                    streetName: addressData.streetName
                });
                setSelectedCity(addressData.city_id);
                setSelectedDistrict(addressData.district_id);
                setSelectedWard(addressData.ward);
            } catch (error) {

                toast.error('Error fetching address details: ' + (error.response?.data?.message || error.message));
            }
        };

        fetchAddressDetail();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setAddressData({ ...addressData, [name]: value });
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        const cityName = cities.find((city) => city.code == selectedCity)?.name;
        const districtName = districts.find((district) => district.code == selectedDistrict)?.name;
        const wardName = wards.find((ward) => ward.name == selectedWard)?.name;
        const updatedAddress = {
            ...addressData,
            city: cityName,
            city_id: selectedCity,
            district: districtName,
            district_id: selectedDistrict,
            ward: wardName,
            dateOfBirth: formatDate(addressData.dateOfBirth),
            updatedAt: new Date().toISOString(),
        };
        setIsLoading(true);

        await putAddressInfo(updatedAddress, localStorage.getItem("userId")).then(async (res) => {
            toast.success('Sửa thành công');
            setIsLoading(false);
            // navigate('/my-address');
            return;

        });
    };


    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <Grid sx={{ mb: 2 }}>
                <Sheet variant="outlined" sx={{ display: 'flex', flexDirection: 'column', borderRadius: 'md' }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ ml: "5px" }}>
                        <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Trang chủ
                        </Link>
                        <Link underline="hover" color="inherit" onClick={() => navigate("/my-account")}>
                            Tài khoản
                        </Link>
                        <Link underline="hover" color="inherit" onClick={() => navigate("/my-address")}>
                            Sổ địa chỉ
                        </Link>
                    </Breadcrumbs>
                </Sheet>
            </Grid>

            <Grid container spacing={2}>
                <Grid xs={12} md={3}>
                    <Sheet variant="outlined" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, borderRadius: 'md' }}>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-account")}>Thông tin tài khoản</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} >Tích lũy điểm</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Chia sẻ</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Đổi quà</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Quản lý đơn hàng</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-address")}>Sổ địa chỉ</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Sản phẩm bạn đã xem</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-passWord")}>Đổi mật khẩu</Typography>
                    </Sheet>
                </Grid>

                <Grid xs={12} md={9}>
                    <Box p={0}>
                        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md' }}>
                                <Typography level="h5" fontWeight="lg" gutterBottom>THÔNG TIN ĐỊA CHỈ</Typography>

                                <Grid container spacing={2} ml={15}>
                                    <Grid xs={12} sm={9}>
                                        <Grid spacing={2}>
                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel required>Họ và Tên</FormLabel>
                                                    <Input
                                                        disabled
                                                        placeholder="Họ và Tên"
                                                        value={addressData.fullName}
                                                        name="fullName"
                                                        onChange={handleChange}

                                                    />

                                                </FormControl>
                                            </Grid>
                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel >Thành phố</FormLabel>
                                                    <Select value={selectedCity || ''}
                                                        onChange={(e, v) => handleCityChange(v)}
                                                        placeholder="Chọn thành phố">
                                                        <Option value="" disabled>
                                                            Chọn tỉnh thành
                                                        </Option>
                                                        {cities.map((city) => (
                                                            <Option key={city.code} value={city.code}>
                                                                {city.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel >Quận/Huyện</FormLabel>
                                                    <Select value={selectedDistrict || ''}
                                                        onChange={(e, v) => handleDistrictChange(v)}
                                                        placeholder="Chọn quận huyện">
                                                        <Option value="" disabled>
                                                            Chọn quận huyện
                                                        </Option>
                                                        {districts.map((district) => (
                                                            <Option key={district.code} value={district.code}>
                                                                {district.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel >Phường/Xã</FormLabel>
                                                    <Select value={selectedWard || ''} onChange={(e, v) => handleWardChange(v)}
                                                        placeholder="Chọn phường xã">
                                                        <Option value="" disabled>
                                                            Chọn phường xã
                                                        </Option>
                                                        {wards.map((ward) => (
                                                            <Option key={ward.code} value={ward.name}>
                                                                {ward.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel>Tên đường</FormLabel>
                                                    <Input
                                                        name="streetName"
                                                        value={addressData.streetName}
                                                        placeholder='Tên đường'
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid xs={6} sx={{ marginTop: 1 }}>
                                                <Button loading={isLoading} variant="soft" type="submit" color='primary' sx={{ marginRight: 1 }}>
                                                    Cập Nhật
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Sheet>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}