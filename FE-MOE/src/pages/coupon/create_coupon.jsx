import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Grid, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, IconButton, } from '@mui/material';
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { postCoupon } from '~/apis/couponApi';
import { Link } from 'react-router-dom';

const CreateCoupon = () => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const [discountType, setDiscountType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const formatDate = (dateString, time = "00:00:00") => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year} | ${time}`;
    };

    const onSubmit = async (data) => {
        try {
            await postCoupon({
                code: data.code,
                name: data.name,
                discountValue: data.discountValue,
                discountType: discountType == 'percentage' ? 'percentage' : 'pixed_amount',
                maxValue: data.maxValue,
                quantity: data.quantity,
                conditions: data.conditions,
                startDate: formatDate(data.startDate),
                endDate: formatDate(data.endDate),
                type: data.type === 'public' ? 'public' : 'personal',
                description: data.description,              
                userId: localStorage.getItem("userId"),
            });
            console.log("Coupon created successfully", data);
            location.href = "/coupon";
        } catch (error) {
            console.error("Error creating coupon", error);
        }
    };

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

    const handleCustomerSelect = (index) => {
        setSelectedCustomers(prev => {
            const newSelection = [...prev];
            if (newSelection.includes(index)) {
                newSelection.splice(newSelection.indexOf(index), 1);
            } else {
                newSelection.push(index);
            }
            return newSelection;
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allSelected = filteredCustomers.map((_, index) => index);
            setSelectedCustomers(allSelected);
        } else {
            setSelectedCustomers([]);
        }
    };

    return (
        <Container
            maxWidth="max-width"
            className="bg-white"
            style={{ height: "100%", marginTop: "15px" }}
        >
            <Box p={4}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h4" mb={2}>Tạo Phiếu Giảm Giá</Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
                            <TextField
                                variant="outlined"
                                label="Mã phiếu giảm giá"
                                {...register('code', { required: true })}
                                error={!!errors.code}
                                helperText={errors.code && 'Mã phiếu giảm giá là bắt buộc'}
                                fullWidth
                            />

                            <TextField
                                variant="outlined"
                                label="Tên phiếu giảm giá"
                                {...register('name', { required: true })}
                                error={!!errors.name}
                                helperText={errors.name && 'Tên phiếu giảm giá là bắt buộc'}
                                fullWidth
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
                                        <RadioGroup {...register('type')} defaultValue="public">
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
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Link to={'/coupon'} className='btn btn-danger w-100' type="submit" variant="contained" >
                                        Quay lại
                                    </Link>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type="submit" className='w-100' variant="contained" color="primary" >
                                        Thêm mới
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="h4" >Danh Sách Khách Hàng</Typography>
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
                                        {type === 'personal' && (
                                            <Checkbox
                                                checked={selectedCustomers.length === filteredCustomers.length && selectedCustomers.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        )}
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
                                            {type === 'personal' && (
                                                <Checkbox
                                                    checked={selectedCustomers.includes(index)}
                                                    onChange={() => handleCustomerSelect(index)}
                                                />
                                            )}
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

export default CreateCoupon;
