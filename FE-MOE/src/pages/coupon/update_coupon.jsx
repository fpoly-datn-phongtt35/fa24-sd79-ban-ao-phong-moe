import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateCoupon, detailCoupon } from '~/apis/couponApi';
import { Link, useParams } from 'react-router-dom';
import {
    TextField, Button, Box, Grid, Typography, FormControl, FormLabel,
    RadioGroup, FormControlLabel, Radio, Checkbox, IconButton
} from '@mui/material';
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent, faDollarSign, faCamera } from '@fortawesome/free-solid-svg-icons';

const UpdateCoupon = () => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const [discountType, setDiscountType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { id } = useParams();
    const [couponType, setCouponType] = useState('public');
    const [image, setImage] = useState(null);

    const formatDate = (dateString, time = "00:00:00") => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year} | ${time}`;
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file type and size
            if (file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024) { // Max 2MB
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Get the base64 string and remove the header
                    const base64String = reader.result.split(',')[1];
                    setImage(base64String); // Store only the raw base64 string
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please upload a valid image file (max 2MB).");
            }
        }
    };

    // Submit form data
    const onSubmit = async (data) => {
        try {
            await updateCoupon(id, {
                code: data.code,
                name: data.name,
                discountValue: data.discountValue,
                discountType: discountType,
                maxValue: data.maxValue,
                quantity: data.quantity,
                conditions: data.conditions,
                startDate: formatDate(data.startDate),
                endDate: formatDate(data.endDate),
                type: couponType,
                description: data.description,
                userId: localStorage.getItem("userId"),
            });
            console.log("Coupon updated successfully", data);
            location.href = "/coupon";
        } catch (error) {
            console.error("Error updating coupon", error);
        }
    };

    // Fetch coupon details to populate the form
    useEffect(() => {
        const fetchCouponDetail = async () => {
            try {
                const coupon = await detailCoupon(id);
                const couponData = coupon.data;
                setValue('code', couponData.code);
                setValue('name', couponData.name);
                setValue('discountValue', couponData.discountValue);
                setValue('maxValue', couponData.maxValue);
                setValue('quantity', couponData.quantity);
                setValue('conditions', couponData.conditions);
                setValue('startDate', couponData.startDate.split(' ')[0]);
                setValue('endDate', couponData.endDate.split(' ')[0]);
                setCouponType(couponData.type);
                setValue('description', couponData.description);
                setDiscountType(couponData.discountType);
            } catch (error) {
                console.log("Error fetching coupon details", error);
            }
        };
        fetchCouponDetail();
    }, [id, setValue]);

    // Customers list
    const customers = [
        { name: 'Nguyễn Văn Nhật', phone: '0261748212', email: 'nhatnguyendzpro@gmail.com', dob: '01-01-1990' },
        { name: 'Anh Lê', phone: '0562718362', email: 'anhle@gmail.com', dob: '20-12-2001' },
        { name: 'Tường Triệu', phone: '0253718362', email: 'tuongtrieu@gmail.com', dob: '20-12-2000' },
        { name: 'Quỳnh Trang', phone: '0452716362', email: 'quynhtrang123@gmail.com', dob: '20-12-2001' },
        { name: 'Nguyễn Thị Thùy Dương', phone: '0647536475', email: 'nguyenthithuyduong948@gmail.com', dob: '20-12-2023' },
    ];

    const type = watch('type', 'public');
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container
            maxWidth="max-width"
            className="bg-white"
            style={{ height: "100%", marginTop: "15px" }}
        >
            <Box p={4}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="h4" mr={2}>Tạo Phiếu Giảm Giá</Typography>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="image-upload">
                                <IconButton component="span" color="primary">
                                    <FontAwesomeIcon icon={faCamera} />
                                </IconButton>
                            </label>
                        </Box>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
                            <TextField
                                variant="outlined"
                                label="Mã phiếu giảm giá"
                                {...register('code', { required: true })}
                                error={!!errors.code}
                                helperText={errors.code && 'Mã phiếu giảm giá là bắt buộc'}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                variant="outlined"
                                label="Tên phiếu giảm giá"
                                {...register('name', { required: true })}
                                error={!!errors.name}
                                helperText={errors.name && 'Tên phiếu giảm giá là bắt buộc'}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Giá trị"
                                        type="number"
                                        {...register('discountValue', { required: true, min: 1 })}
                                        error={!!errors.discountValue}
                                        helperText={errors.discountValue && 'Giá trị giảm giá phải lớn hơn 0'}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: (
                                                <Box display="flex" alignItems="center">
                                                    <IconButton
                                                        onClick={() => {
                                                            setDiscountType('percentage');
                                                            setValue('discountValue', 10);
                                                        }}
                                                        color={discountType === 'percentage' ? 'primary' : 'default'}
                                                    >
                                                        <FontAwesomeIcon icon={faPercent} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            setDiscountType('fixed_amount');
                                                            setValue('discountValue', 500);
                                                        }}
                                                        color={discountType === 'fixed_amount' ? 'primary' : 'default'}
                                                    >
                                                        <FontAwesomeIcon icon={faDollarSign} />
                                                    </IconButton>
                                                </Box>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Giá trị tối thiểu cho đơn hàng"
                                        type="number"
                                        {...register('maxValue', { required: true, min: 1 })}
                                        error={!!errors.maxValue}
                                        helperText={errors.maxValue && 'Giá trị đơn hàng tối thiểu phải lớn hơn 0'}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Số lượng"
                                        type="number"
                                        {...register('quantity', { required: true, min: 1 })}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity && 'Số lượng phải lớn hơn 0'}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Điều kiện"
                                        type="number"
                                        {...register('conditions', { required: true, min: 1 })}
                                        error={!!errors.condition}
                                        helperText={errors.condition && 'Điều kiện là bắt buộc'}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                variant="outlined"
                                label="Từ ngày"
                                type="date"
                                {...register('startDate', { required: true })}
                                error={!!errors.startDate}
                                helperText={errors.startDate && 'Ngày bắt đầu là bắt buộc'}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />

                            <TextField
                                variant="outlined"
                                label="Đến ngày"
                                type="date"
                                {...register('endDate', { required: true })}
                                error={!!errors.endDate}
                                helperText={errors.endDate && 'Ngày kết thúc là bắt buộc'}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />

                            <FormControl component="fieldset">
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormLabel component="legend">Kiểu</FormLabel>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <RadioGroup value={couponType} onChange={(e) => setCouponType(e.target.value)}>
                                            <div className='flex'>
                                                <FormControlLabel value="public" control={<Radio />} label="Công khai" />
                                                <FormControlLabel value="personal" control={<Radio />} label="Cá nhân" />
                                            </div>
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                            </FormControl>

                            <TextField
                                variant="outlined"
                                label="Mô tả"
                                {...register('description', { required: true })}
                                error={!!errors.description}
                                helperText={errors.description && 'Mô tả là bắt buộc'}
                                multiline
                                rows={3}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />

                            {image && (
                                <Box mb={2}>
                                    <img src={image} alt="Uploaded" style={{ width: '10%', height: 'auto' }} />
                              </Box>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Link to={'/coupon'} className='btn btn-danger w-100' type="submit" variant="contained" >
                                        Quay lại
                                    </Link>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type="submit" className='w-100' variant="contained" color="primary" >
                                        Sửa dữ liệu
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Customer List */}
                    <Grid item xs={6}>
                        <Typography variant="h4">Danh Sách Khách Hàng</Typography>
                        <TextField
                            variant="outlined"
                            label="Tìm kiếm khách hàng"
                            fullWidth
                            margin="normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>
                                        <Checkbox />
                                    </th>
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            <Checkbox />
                                        </td>
                                        <td>{customer.name}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.dob}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default UpdateCoupon;
