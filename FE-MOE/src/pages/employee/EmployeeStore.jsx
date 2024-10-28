import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, Typography, Paper, Avatar } from '@mui/material';
import { toast } from 'react-toastify';
import { postCustomer, postcustomerImage } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Button, FormControl, FormLabel, Input, Link, Option, Radio, RadioGroup, Select } from '@mui/joy';
import HomeIcon from "@mui/icons-material/Home";
import { useForm } from 'react-hook-form';
import { getAllPositions } from '~/apis/employeeApi';
import { getAllProvinces, getDistrictsByProvinceId, getWardsByDistrictId } from '~/apis/addressEmployeeApi';

export const EmployeeStore = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageObject, setImageObject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [positions, setPositions] = useState([]);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchPosition = async () => {
            await getAllPositions().then((res) => setPositions(res.data))
        }

        const fetchProvinces = async () => {
            await getAllProvinces().then((res) => setProvinces(res))
        }
        fetchPosition();
        fetchProvinces();
    }, [])

    // useEffect(() => {
    //     handleProvinceChange();
    // }, [selectedProvince])

    useEffect(() => {
        if (selectedProvince) {
            handleProvinceChange();
        }
    }, [selectedProvince]);

    const formatDate = (dateString, time = "00:00:00") => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year} | ${time}`;
    };

    const handleProvinceChange = async () => {
        try {
            const res = await getDistrictsByProvinceId(selectedProvince);
            setDistricts(res);
            setSelectedDistrict(null); // Reset the selected district when province changes
            setWards([]); // Reset wards when province changes
        } catch (error) {
            console.error(error);
        }
    };

    const handleDistrictChange = async (event) => {
        const districtId = event.target.value;
        setSelectedDistrict(districtId);
        try {
            const res = await getWardsByDistrictId(districtId);
            setWards(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (event) => {
        var file = event.target.files[0];
        var url = URL.createObjectURL(file)
        setImagePreview(url)
        setImageObject(file)
    }

    const onSubmit = async (data) => {
        console.log("Submited..");
        console.log(data);


    }

    return (
        <Container maxWidth="max-width" sx={{ height: "100vh", marginTop: "15px" }}>
            <Box mt={4} mb={4}>
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    marginBottom={2}
                    height={"50px"}
                >
                    <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
                        <Link
                            disabled={isLoading}
                            underline="hover"
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                            color="inherit"
                            onClick={() => navigate("/")}
                        >
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Trang chủ
                        </Link>
                        <Link
                            disabled={isLoading}
                            underline="hover"
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                            color="inherit"
                            onClick={() => navigate("/employee")}
                        >
                            Quản lý nhân viên
                        </Link>
                        <Typography sx={{ color: "text.white", cursor: "pointer" }}>
                            Thêm nhân viên
                        </Typography>
                    </Breadcrumbs>
                </Grid>
                <Paper elevation={3}>
                    <Box p={4}>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Avatar
                                            src={imagePreview || '/placeholder-image.png'}
                                            alt="User Image"
                                            sx={{ width: 150, height: 150 }}
                                        />
                                        <Button
                                            variant="soft"
                                            component="label"
                                            color='primary'
                                            sx={{ mt: 2 }}
                                            disabled={isLoading}
                                        >
                                            Chọn Ảnh
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={handleImageChange}
                                            />
                                        </Button>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Họ</FormLabel>
                                                <Input
                                                    placeholder='Họ'
                                                    {...register("last_name", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Tên</FormLabel>
                                                <Input
                                                    placeholder='Nhập tên'
                                                    {...register("first_name", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Tên tài khoản</FormLabel>
                                                <Input
                                                    placeholder='Nhập tên tài khoản'
                                                    {...register("username", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Mật Khẩu</FormLabel>
                                                <Input
                                                    type="password"
                                                    placeholder='Nhập mật Khẩu'
                                                    {...register("password", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Email</FormLabel>
                                                <Input
                                                    placeholder='Nhập email'
                                                    type="email"
                                                    {...register("email", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Số Điện Thoại</FormLabel>
                                                <Input
                                                    placeholder='Nhập số Điện Thoại'
                                                    {...register("phone_number", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Giới tính</FormLabel>
                                                <RadioGroup >
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Radio
                                                            label="Nam"
                                                            value="MALE"
                                                            name="gender"
                                                        />
                                                        <Radio
                                                            label="Nữ"
                                                            value="FEMALE"
                                                            name="gender"
                                                        />
                                                        <Radio
                                                            label="Khác"
                                                            value="OTHER"
                                                            name="gender"
                                                        />

                                                    </Box>

                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Ngày sinh</FormLabel>
                                                <Input
                                                    placeholder='Ngày sinh'
                                                    type='date'
                                                    {...register("date_of_birth", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Lương</FormLabel>
                                                <Input
                                                    type='number'
                                                    placeholder='Nhập lương'
                                                    {...register("salary", { required: true })}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Chức vụ</FormLabel>
                                                <Select defaultValue={0} placeholder="Chọn chức vụ" {...register("positionId", { required: true })}>
                                                    {
                                                        positions?.map((item) => (
                                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Thành phố</FormLabel>
                                                <Select defaultValue={0} placeholder="Chọn tỉnh/thành phố"
                                                    {...register("province", { required: true })}
                                                    onChange={(event, value) => {
                                                        console.log(value);
                                                        setSelectedProvince(value);
                                                    }}
                                                >
                                                    {
                                                        provinces?.map((item) => (
                                                            <Option key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Quận/Huyện</FormLabel>
                                                <Select
                                                    defaultValue={0}
                                                    placeholder="Chọn quận/huyện"
                                                    {...register("district", { required: true })}
                                                    onChange={(event, value) => {
                                                        console.log("Selected District ID:", value);
                                                        // Bạn có thể thực hiện thêm các hành động khác ở đây nếu cần
                                                    }}
                                                >
                                                    {districts?.map((item) => (
                                                        <Option key={item.DistrictID} value={item.DistrictID}>
                                                            {item.DistrictName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Xã/Phường</FormLabel>
                                                <Select
                                                    placeholder="Chọn xã/phường"
                                                    defaultValue={0}
                                                >
                                                    {wards.map((ward) => (
                                                        <Option key={ward.id} value={ward.id}>{ward.name}</Option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>


                                        <Grid item xs={12} sm={6}>
                                            <FormControl>
                                                <FormLabel required>Tên đường</FormLabel>
                                                <Input
                                                    name="streetName"
                                                    placeholder='Tên đường'
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6} sx={{ marginTop: 1 }}>
                                        <Button loading={isLoading} variant="soft" type="submit" color="primary" sx={{ marginRight: 1 }}>
                                            Thêm Người Dùng
                                        </Button>
                                        <Button disabled={isLoading} variant="soft" type="submit" color="danger" onClick={() => navigate("/employee")}>
                                            Hủy
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};
