import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Grid, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, IconButton, InputAdornment } from '@mui/material';
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postCoupon, postCouponImage } from '~/apis/couponApi';
import { Link, useNavigate } from 'react-router-dom';
import { faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import CouponImage from '~/components/common/CouponImage';
import { fetchAllCustomer } from '~/apis/customerApi';


const CreateCoupon = () => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const [discountType, setDiscountType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [images, setImages] = useState(null);
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [discountTypeError, setDiscountTypeError] = useState('');
    const [imagesError, setImagesError] = useState('');

    const formatDate = (dateString, time = "00:00:00") => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year} | ${time}`;
    };

    useEffect(() => {
        handleSetCustomer();
      }, []);
    

    const handleDiscountTypeChange = (type) => {
        setDiscountType(type);
        setDiscountTypeError('');
    };

    const handleImagesUpload = (files) => {
        setImages(files);
        setImagesError('');
    };

    const handleSetCustomer = async () => {
        const response = await fetchAllCustomer();
        setCustomers(response.data);
    };

    const onSubmit = async (data) => {
        let isValid = true;

        // Kiểm tra discountType
        if (!discountType) {
            setDiscountTypeError('Discount type is required');
            isValid = false;
        } else {
            setDiscountTypeError('');
        }

        // Kiểm tra images
        if (!images || images.length === 0) {
            setImagesError('Images must not be null!');
            isValid = false;
        } else {
            setImagesError('');
        }

        if (!isValid) {
            return;
        }

        const coupon = {
            code: data.code,
            name: data.name,
            discountValue: data.discountValue,
            discountType: discountType,
            maxValue: data.maxValue,
            quantity: data.quantity,
            conditions: data.conditions,
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            type: data.type,
            description: data.description,
            userId: localStorage.getItem("userId"),
        };

        // Gọi API để tạo coupon
        try {
            const response = await postCoupon(coupon);
            let formData = new FormData();
            formData.append("couponID", response);
            formData.append("images", images[0]);
            await postCouponImage(formData);
            navigate("/coupon");
        } catch (error) {
            console.error(error);
        }
    };

    const formatDateCustomer = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
      };

    const type = watch('type', 'public');
    // const filteredCustomers = customers.filter(customer =>
    //     customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const handleCustomerSelect = (index) => {
        setSelectedCustomers(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    };

    const handleSelectAll = (event) => {
        setSelectedCustomers(event.target.checked ? filteredCustomers.map((_, index) => index) : []);
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
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="h4" mr={2}>Tạo Phiếu Giảm Giá</Typography>
                        </Box>


                        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2} >

                            <TextField
                                variant="outlined"
                                label="Mã phiếu giảm giá"
                                {...register('code', {
                                    required: 'Code cannot be empty',
                                    minLength: {
                                        value: 5,
                                        message: 'Code min 5 characters',

                                    },
                                    maxLength: {
                                        value: 12,
                                        message: 'Code should not exceed 12 characters',
                                    },
                                })}
                                error={!!errors.code}
                                helperText={errors.code?.message}
                            />


                            <TextField
                                variant="outlined"
                                label="Tên phiếu giảm giá"
                                {...register('name', {
                                    required: 'Name cannot be empty',     
                                    minLength: {
                                        value: 5,
                                        message: 'Name min 5 characters',
                                    },                            
                                    maxLength: {
                                        value: 50,
                                        message: 'Name should not exceed 50 characters',
                                    },
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />


                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Giá trị"
                                        type="number"
                                        {...register('discountValue', {
                                            required: 'Discount value is required',
                                            min: {
                                                value: 0.01,
                                                message: 'Discount value must be greater than zero',
                                            },
                                        })}
                                        error={!!errors.discountValue}
                                        helperText={errors.discountValue?.message}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleDiscountTypeChange('percentage')}
                                                        color={discountType === 'percentage' ? 'primary' : 'default'}
                                                    >
                                                        <FontAwesomeIcon icon={faPercent} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDiscountTypeChange('fixed_amount')}
                                                        color={discountType === 'fixed_amount' ? 'primary' : 'default'}
                                                    >
                                                        <FontAwesomeIcon icon={faDollarSign} />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {discountTypeError && (
                                        <Typography color="error">{discountTypeError}</Typography>
                                    )}

                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Giá trị tối thiểu cho đơn hàng"
                                        type="number"
                                        {...register('maxValue', {
                                            required: 'Minimum order value is required',
                                            min: {
                                                value: 0.01,
                                                message: 'Minimum order value must be greater than zero',
                                            },
                                        })}
                                        error={!!errors.maxValue}
                                        helperText={errors.maxValue?.message}
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
                                        {...register('quantity', {
                                            required: 'Quantity is required',
                                            min: {
                                                value: 1,
                                                message: 'Quantity must be at least 1',
                                            },
                                        })}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity?.message}
                                        fullWidth
                                    />

                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Điều kiện"
                                        type="number"
                                        {...register('conditions', {
                                            required: 'Conditions order value is required',
                                            min: {
                                                value: 0.01,
                                                message: 'Minimum order value must be greater than zero',
                                            },
                                        })}
                                        error={!!errors.conditions}
                                        helperText={errors.conditions?.message}
                                        fullWidth
                                    />

                                </Grid>
                            </Grid>

                            <TextField
                                variant="outlined"
                                label="Từ ngày"
                                type="date"
                                {...register('startDate', { required: 'Start date is required' })}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />


                            <TextField
                                variant="outlined"
                                label="Đến ngày"
                                type="date"
                                {...register('endDate', { required: 'End date is required' })}
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />


                            <FormControl component="fieldset" error={!!errors.type}>
                                <FormLabel component="legend">Kiểu</FormLabel>
                                <RadioGroup {...register('type', { required: 'Type is required' })} defaultValue="public">
                                    <div className='flex'>
                                        <FormControlLabel value="public" control={<Radio />} label="Công khai" />
                                        <FormControlLabel value="personal" control={<Radio />} label="Cá nhân" />
                                    </div>
                                </RadioGroup>
                                {errors.type && (
                                    <Typography color="error">{errors.type.message}</Typography>
                                )}
                            </FormControl>


                            <TextField
                                variant="outlined"
                                label="Mô tả"
                                {...register('description', {
                                    maxLength: {
                                        value: 255,
                                        message: 'Description should not exceed 255 characters',
                                    },
                                })}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                multiline
                                rows={3}
                                fullWidth
                            />


                            <Grid item xs={12}>
                                <CouponImage onImagesUpload={handleImagesUpload} />
                                {imagesError && (
                                    <Typography color="error">{imagesError}</Typography>
                                )}
                            </Grid>


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
                                {customers.map((customer, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {type === 'personal' && (
                                                <Checkbox
                                                    checked={selectedCustomers.includes(index)}
                                                    onChange={() => handleCustomerSelect(index)}
                                                />
                                            )}
                                        </td>
                                        <td>{customer.firstName}</td>
                                        <td>{customer.phoneNumber}</td>
                                        <td>{customer.email}</td>
                                        <td>{formatDateCustomer(customer.dateOfBirth)}</td>
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
