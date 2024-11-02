import React, { useState } from 'react';
import {
    Box,
    Grid,
    Avatar,
    ModalDialog,
    Typography,
    Modal,
} from '@mui/joy';
import { toast } from 'react-toastify';
import { postCustomer, postcustomerImage } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
} from '@mui/joy';

const AddCustomerModal = ({ open, setOpenModal }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageObject, setImageObject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        customerAddress: '',
        address: {
            city: '',
            district: '',
            ward: '',
            streetName: '',
        },
        user: {
            email: '',
            password: '',
            username: '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in customerData.address) {
            setCustomerData((prevData) => ({
                ...prevData,
                address: { ...prevData.address, [name]: value }
            }));
        } else if (name in customerData.user) {
            setCustomerData((prevData) => ({
                ...prevData,
                user: { ...prevData.user, [name]: value }
            }));
        } else {
            setCustomerData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Format the date of birth before sending to the API
            const formattedDateOfBirth = formatDate(customerData.dateOfBirth);
            const newCustomerData = {
                ...customerData,
                dateOfBirth: formattedDateOfBirth,
            };

            // Post the customer data to the API
            const res = await postCustomer(newCustomerData);
            if (res?.id && imageObject) { // Check if res contains an ID
                const formData = new FormData();
                formData.append('images', imageObject);
                formData.append('customerId', res.id); // Use customerId instead of productId

                await postcustomerImage(formData);
            }
            toast.success('Thêm thành công');
            setOpenModal(false); // Close modal on success
            navigate('/customer');
        } catch (error) {
            console.error(error); // Log the error for debugging
            toast.error('Thêm thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageObject(file);
        }
    };

    return (
        <Modal open={open} onClose={() => setOpenModal(false)}>
            <ModalDialog aria-labelledby="add-customer-title" maxWidth="md">
                <Typography id="add-customer-title" level="h5" mb={2}>
                    Thêm Khách Hàng
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
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
                                    color="primary"
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
                                            value={customerData.lastName}
                                            name="lastName"
                                            onChange={handleChange}
                                            placeholder="Họ"
                                            autoComplete="family-name"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Tên</FormLabel>
                                        <Input
                                            value={customerData.firstName}
                                            name="firstName"
                                            onChange={handleChange}
                                            placeholder="Tên"
                                            autoComplete="given-name"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Tên tài khoản</FormLabel>
                                        <Input
                                            value={customerData.user.username}
                                            name="username"
                                            onChange={handleChange}
                                            placeholder="Tên tài khoản"
                                            autoComplete="username"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Mật Khẩu</FormLabel>
                                        <Input
                                            value={customerData.user.password}
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            placeholder="Mật Khẩu"
                                            autoComplete="new-password"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Email</FormLabel>
                                        <Input
                                            value={customerData.user.email}
                                            name="email"
                                            onChange={handleChange}
                                            placeholder="Email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Số Điện Thoại</FormLabel>
                                        <Input
                                            value={customerData.phoneNumber}
                                            name="phoneNumber"
                                            onChange={handleChange}
                                            placeholder="Số Điện Thoại"
                                            autoComplete="tel"
                                            required
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Giới tính</FormLabel>
                                        <RadioGroup
                                            orientation="horizontal"
                                            onChange={handleChange}
                                            name="gender"
                                            required
                                        >
                                            <Radio
                                                label="Nam"
                                                checked={customerData.gender === 'MALE'}
                                                value="MALE"
                                            />
                                            <Radio
                                                label="Nữ"
                                                checked={customerData.gender === 'FEMALE'}
                                                value="FEMALE"
                                            />
                                            <Radio
                                                label="Khác"
                                                checked={customerData.gender === 'OTHER'}
                                                value="OTHER"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Ngày sinh</FormLabel>
                                        <Input
                                            name="dateOfBirth"
                                            value={customerData.dateOfBirth}
                                            onChange={handleChange}
                                            placeholder="Ngày sinh"
                                            type="date"
                                            autoComplete="bday"
                                            required
                                        />
                                    </FormControl>
                                </Grid>

                                {/* Address Fields */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Thành phố</FormLabel>
                                        <Input
                                            name="city"
                                            value={customerData.address.city}
                                            placeholder="Thành phố"
                                            onChange={handleChange}
                                            autoComplete="address-level1"
                                            required
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Quận/Huyện</FormLabel>
                                        <Input
                                            name="district"
                                            value={customerData.address.district}
                                            placeholder="Quận/Huyện"
                                            onChange={handleChange}
                                            autoComplete="address-level2"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Phường/Xã</FormLabel>
                                        <Input
                                            name="ward"
                                            value={customerData.address.ward}
                                            placeholder="Phường/Xã"
                                            onChange={handleChange}
                                            autoComplete="address-line2"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl>
                                        <FormLabel required>Tên đường</FormLabel>
                                        <Input
                                            name="streetName"
                                            value={customerData.address.streetName}
                                            placeholder="Tên đường"
                                            onChange={handleChange}
                                            autoComplete="address-line1"
                                            required
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button type="submit" color="primary" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Thêm'}
                        </Button>
                    </Box>
                </Box>
            </ModalDialog>
        </Modal>
    );
};

export default AddCustomerModal;
