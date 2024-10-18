import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Link, Button, Box, Grid, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, IconButton, InputAdornment } from '@mui/material';
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postCoupon, postCouponImage } from '~/apis/couponApi';
import { useNavigate } from 'react-router-dom';
import { faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import CouponImage from '~/components/common/CouponImage';
import { fetchAllCustomer } from '~/apis/customerApi';
import { Breadcrumbs } from '@mui/joy';
import HomeIcon from "@mui/icons-material/Home";

const CreateCoupon = () => {
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm();
    const [discountType, setDiscountType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState(null);
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [discountTypeError, setDiscountTypeError] = useState('');
    const [imagesError, setImagesError] = useState('');
    const [selectedCustomersError, setSelectedCustomersError] = useState('');

    const type = watch('type', 'PUBLIC');
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

    const onSubmit = async (data) => {
        let isValid = true;
        if (!discountType) {
            setDiscountTypeError('Discount type is required');
            isValid = false;
        } else {
            setDiscountTypeError('');
        }
        if (!images || images.length === 0) {
            setImagesError('Images must not be null!');
            isValid = false;
        } else {
            setImagesError('');
        }
        if (data.type === 'PERSONAL' && (!selectedCustomers || selectedCustomers.length === 0)) {
            setSelectedCustomersError('At least one customer must be selected for PERSONAL coupons.');
            isValid = false;
        } else {
            setSelectedCustomersError('');
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
            customerIds: data.type === 'PERSONAL' ? selectedCustomers : null,
        };

        try {
            const response = await postCoupon(coupon);

            let formData = new FormData();
            formData.append("couponID", response);
            images.forEach((image, index) => {
                formData.append("images", images[0]);
            });
            await postCouponImage(formData);
            navigate("/coupon");
        } catch (error) {
            console.error("Error creating coupon or uploading images:", error);
        }
    };



    const formatDateCustomer = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const handleSetCustomer = async () => {
        const response = await fetchAllCustomer();
        setCustomers(response.data.content);
        console.log(response)
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allCustomerIds = customers.map(customer => customer.id);
            setSelectedCustomers(allCustomerIds);
        } else {
            setSelectedCustomers([]);
        }
    };
    const handleSelectCustomer = (customerId) => {
        setSelectedCustomers((prevSelected) => {
            if (prevSelected.includes(customerId)) {
                return prevSelected.filter(id => id !== customerId);
            } else {
                return [...prevSelected, customerId];
            }
        });
    };



    const isSelected = (customerId) => selectedCustomers.includes(customerId);

    return (
        <Container
            maxWidth="max-width"
            className="bg-white"
            style={{ height: "100%", marginTop: "15px" }}
        >
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
                <Link
                    underline="hover"
                    sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    color="inherit"
                    onClick={() => navigate("/")}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Trang chủ
                </Link>
                <Link
                    underline="hover"
                    sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    color="inherit"
                    onClick={() => navigate("/coupon")}
                >
                    Quản lý phiếu giảm giá
                </Link>
                <Typography sx={{ color: "text.white", cursor: "pointer" }}>
                    Thêm phiếu giảm giá
                </Typography>
            </Breadcrumbs>
            <Box p={4}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box display="flex" alignItems="center" mb={2}>

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
                                                        onClick={() => handleDiscountTypeChange('PERCENTAGE')}
                                                        color={discountType === 'PERCENTAGE' ? 'primary' : 'default'}
                                                    >
                                                        <FontAwesomeIcon icon={faPercent} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDiscountTypeChange('FIXED_AMOUNT')}
                                                        color={discountType === 'FIXED_AMOUNT' ? 'primary' : 'default'}
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

                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    marginTop: '10px', // Fix margin top value
                                }}
                            >
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item style={{ marginRight: '320px' }}>
                                        <FormControl component="fieldset" error={!!errors.type}>
                                            <FormLabel component="legend">Kiểu</FormLabel>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <Controller
                                            name="type"
                                            control={control}
                                            defaultValue="PUBLIC"
                                            rules={{ required: 'Type is required' }}
                                            render={({ field }) => (
                                                <RadioGroup
                                                    {...field}
                                                    row
                                                >
                                                    <FormControlLabel value="PUBLIC" control={<Radio />} label="Công khai" />
                                                    <FormControlLabel value="PERSONAL" control={<Radio />} label="Cá nhân" />
                                                </RadioGroup>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {errors.type && (
                                            <Typography color="error">{errors.type.message}</Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>

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
                                    <Button type="submit" className='w-100' variant="contained" color="primary" >
                                        Thêm mới
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>

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
                                        <Checkbox
                                            checked={selectedCustomers.length === customers.length && customers.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={9} align="center">
                                            Không tìm thấy khách hàng!
                                        </td>
                                    </tr>
                                )}
                                {customers && customers.map((customer, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Checkbox
                                                checked={isSelected(customer.id)}
                                                onChange={() => handleSelectCustomer(customer.id)}
                                            />
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
