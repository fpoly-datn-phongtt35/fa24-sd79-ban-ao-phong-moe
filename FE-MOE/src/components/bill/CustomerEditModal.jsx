import React, { useState, useEffect } from 'react';
import {
    Modal, Box, FormControl, FormLabel, Input, Select, Option, Button,
    Typography, FormHelperText, IconButton
} from '@mui/joy';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CustomerEditModal({
    customerData,
    setCustomerData,
    cities,
    districts,
    wards,
    selectedCity = '',
    selectedDistrict = '',
    selectedWard = '',
    setCities,
    setDistricts,
    setWards,
    setSelectedCity,
    setSelectedDistrict,
    setSelectedWard,
    open,
    onClose,
    customerId,
    fetchCustomerById,
    putCustomer,
    fetchBillEdit
}) {
    const host = 'https://provinces.open-api.vn/api/';

    // Local customer state to manage form inputs
    const [localCustomerData, setLocalCustomerData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        streetName: '',
        cityId: '',
        districtId: '',
        ward: ''
    });

    useEffect(() => {
        loadCustomerData();
    }, [customerId]);

    const loadCustomerData = async () => {
        if (customerId) {
            const response = await fetchCustomerById(customerId);
            const data = response.data;
            setLocalCustomerData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phoneNumber: data.phoneNumber || '',
                streetName: data.streetName || '',
                cityId: data.cityId || '',
                districtId: data.districtId || '',
                ward: data.customerAddress?.ward || ''
            });

            // Set initial selected values for the dropdowns
            setSelectedCity(data.customerAddress?.cityId || '');
            await handleCityChange(null, data.customerAddress?.cityId);

            setSelectedDistrict(data.customerAddress?.districtId || '');
            await handleDistrictChange(null, data.customerAddress?.districtId);

            setSelectedWard(data.customerAddress?.ward || '');
        }
    };

    // Fetch cities if not already loaded
    useEffect(() => {
        const fetchCities = async () => {
            const response = await axios.get(`${host}?depth=1`);
            setCities(response.data);
        };
        fetchCities();
    }, []);

    const handleCityChange = async (e, v) => {
        const provinceId = v || selectedCity;
        setSelectedCity(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");
        if (provinceId) {
            const response = await axios.get(`${host}p/${provinceId}?depth=2`);
            setDistricts(response.data.districts);
        } else {
            setDistricts([]);
        }
    };

    const handleDistrictChange = async (e, v) => {
        const districtId = v || selectedDistrict;
        setSelectedDistrict(districtId);
        setSelectedWard("");
        if (districtId) {
            const response = await axios.get(`${host}d/${districtId}?depth=2`);
            setWards(response.data.wards);
        } else {
            setWards([]);
        }
    };

    const handleWardChange = (e, v) => {
        setSelectedWard(v);
    };

    const updateCustomer = async () => {
        try {
            const cityName = cities.find((city) => city.code === selectedCity)?.name;
            const districtName = districts.find((district) => district.code === selectedDistrict)?.name;
            const wardName = wards.find((ward) => ward.name === selectedWard)?.name;

            const updatedCustomer = {
                ...localCustomerData,
                city: cityName,
                city_id: selectedCity,
                district: districtName,
                district_id: selectedDistrict,
                ward: wardName,
                updatedAt: new Date().toISOString(),
            };

            const response = await putCustomer(updatedCustomer, customerId);

            if (response && response.status === 200) {
                toast.success('Cập nhật thành công');
                onClose();
            } else {
                toast.error('Cập nhật không thành công, vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Failed to update customer:", error);
            toast.error('Có lỗi xảy ra khi cập nhật thông tin khách hàng.');
        }
        fetchBillEdit();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 1000,
                        p: 4,
                        bgcolor: 'background.paper',
                        borderRadius: 8,
                        position: 'relative'
                    }}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography level="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'red' }}>
                        Chỉnh sửa thông tin khách hàng
                    </Typography>

                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl required error={!localCustomerData.lastName || !localCustomerData.firstName}>
                                <FormLabel>Họ và tên</FormLabel>
                                <Input
                                    value={`${localCustomerData.lastName} ${localCustomerData.firstName}`}
                                    onChange={(e) => {
                                        const [lastName, ...firstNameParts] = e.target.value.split(" ");
                                        setLocalCustomerData({
                                            ...localCustomerData,
                                            lastName,
                                            firstName: firstNameParts.join(" "),
                                        });
                                    }}
                                    size="md"
                                />
                                {!localCustomerData.lastName || !localCustomerData.firstName ? (
                                    <FormHelperText>Họ và tên không được bỏ trống</FormHelperText>
                                ) : null}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl required error={!localCustomerData.phoneNumber}>
                                <FormLabel>Số điện thoại</FormLabel>
                                <Input
                                    value={localCustomerData.phoneNumber || ""}
                                    onChange={(e) =>
                                        setLocalCustomerData({
                                            ...localCustomerData,
                                            phoneNumber: e.target.value,
                                        })
                                    }
                                    variant="outlined"
                                    size="md"
                                />
                                {!localCustomerData.phoneNumber ? (
                                    <FormHelperText>Số điện thoại không được bỏ trống</FormHelperText>
                                ) : null}
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={4}>
                            <FormControl required>
                                <FormLabel>Tỉnh/thành phố</FormLabel>
                                <Select
                                    value={selectedCity || ''}
                                    onChange={(e, v) => {
                                        const selectedCityValue = v;
                                        console.log('Selected City:', selectedCityValue);
                                        handleCityChange(selectedCityValue);  // Xử lý thay đổi tỉnh/thành phố
                                        setSelectedCity(selectedCityValue);  // Cập nhật state cho selectedCity
                                    }}
                                    placeholder="Chọn thành phố"
                                >
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

                        <Grid item xs={12} md={4}>
                            <FormControl required>
                                <FormLabel>Quận/huyện</FormLabel>
                                <Select
                                    value={selectedDistrict || ''}
                                    onChange={(e, v) => {
                                        const selectedDistrictValue = v;
                                        console.log('Selected District:', selectedDistrictValue);
                                        handleDistrictChange(selectedDistrictValue);  // Xử lý thay đổi quận/huyện
                                        setSelectedDistrict(selectedDistrictValue);  // Cập nhật state cho selectedDistrict
                                    }}
                                    placeholder="Chọn quận huyện"
                                >
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

                        <Grid item xs={12} md={4}>
                            <FormControl required>
                                <FormLabel>Xã/phường/thị trấn</FormLabel>
                                <Select
                                    value={selectedWard || ''}
                                    onChange={(e, v) => {
                                        const selectedWardValue = v;
                                        console.log('Selected Ward:', selectedWardValue);
                                        handleWardChange(selectedWardValue);  // Xử lý thay đổi xã/phường
                                        setSelectedWard(selectedWardValue);  // Cập nhật state cho selectedWard
                                    }}
                                    placeholder="Chọn phường xã"
                                >
                                    <Option value="" disabled>
                                        Chọn phường xã
                                    </Option>
                                    {wards.map((ward) => (
                                        <Option key={ward.name} value={ward.name}>
                                            {ward.name}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <FormControl required error={!localCustomerData.streetName}>
                            <FormLabel>Địa chỉ cụ thể</FormLabel>
                            <Input
                                size="md"
                                value={localCustomerData.streetName || ""}
                                onChange={(e) =>
                                    setLocalCustomerData({
                                        ...localCustomerData,
                                        streetName: e.target.value,
                                    })
                                }
                                variant="outlined"
                            />
                            {!localCustomerData.streetName ? (
                                <FormHelperText>Địa chỉ cụ thể không được bỏ trống</FormHelperText>
                            ) : null}
                        </FormControl>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button onClick={updateCustomer} variant="solid" sx={{ backgroundColor: '#FFD700', color: 'black' }}>
                            Lưu thay đổi
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
