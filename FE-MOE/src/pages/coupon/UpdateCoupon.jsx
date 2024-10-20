import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateCoupon, detailCoupon, postCouponImage, deleteCouponImage } from '~/apis/couponApi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    TextField, Button, Box, Grid, Typography, FormControl, FormLabel,
    RadioGroup, FormControlLabel, Radio, Checkbox, IconButton
} from '@mui/material';
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import CouponImage from '~/components/common/CouponImage';
import { fetchAllCustomer } from '~/apis/customerApi';
import { CircularProgress } from '@mui/material';


const UpdateCoupon = () => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const [discountType, setDiscountType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { id } = useParams();
    const [couponType, setCouponType] = useState('public');
    const [images, setImages] = useState(null);
    const navigate = useNavigate();
    const [storedImageUrl, setStoredImageUrl] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [discountTypeError, setDiscountTypeError] = useState('');
    const type = watch('type', 'public');
    const [selectedCustomersError, setSelectedCustomersError] = useState('');
    const [imagesError, setImagesError] = useState('');
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString, time = "00:00:00") => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year} | ${time}`;
    };

    useEffect(() => {
        fetchCouponDetail();
        handleSetCustomer();
    }, []);

    const handleImagesUpload = (files) => {
        setImages(files);
    };

    const onSubmit = async (data) => {
        let isValid = true;

        if (!discountType) {
            setDiscountTypeError('Discount type is required');
            isValid = false;
        } else {
            setDiscountTypeError('');
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
            type: couponType,
            description: data.description,
            userId: localStorage.getItem("userId"),
            customerIds: selectedCustomers,
        };


        try {
            setLoading(true);
            const response = await updateCoupon(id, coupon);
            await deleteCouponImage(response);
            let formData = new FormData();
            formData.append("couponID", response);

            images.forEach((image, index) => {
                formData.append("images", image);
            });

            await postCouponImage(formData);


            navigate("/coupon");
        } catch (error) {
            console.error("Error creating coupon or uploading images:", error);
        } finally {
            setLoading(false);
        }
    };




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
            setValue('description', couponData.description);
            setCouponType(couponData.type); // Ensure type is set
            setDiscountType(couponData.discountType);
            setStoredImageUrl(couponData.imageUrl || '');

            if (couponData.type === 'PERSONAL') {
                const customerIds = couponData.customers.map(customer => customer.id);
                setSelectedCustomers(customerIds);
            } else {
                setSelectedCustomers([]);
            }

            if (couponData.images && couponData.images.length > 0) {
                setImages(couponData.images);
            } else {
                setImages([]);
            }
        } catch (error) {
            console.error("Error fetching coupon details:", error);
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

    const filteredCustomers = customers.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm)
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
                            <Typography variant="h4" mr={2}>Chi Tiết Phiếu Giảm Giá</Typography>
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
                                                            setDiscountType('PERCENTAGE');
                                                            setValue('discountValue', 10);
                                                        }}
                                                        color={discountType === 'PERCENTAGE' ? 'primary' : 'default'}
                                                    >
                                                        <FontAwesomeIcon icon={faPercent} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            setDiscountType('FIXED_AMOUNT');
                                                            setValue('discountValue', 500);
                                                        }}
                                                        color={discountType === 'FIXED_AMOUNT' ? 'primary' : 'default'}
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
                                            <FormControlLabel value="PUBLIC" control={<Radio />} label="Công khai" />
                                            <FormControlLabel value="PERSONAL" control={<Radio />} label="Cá nhân" />
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

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Link to={'/coupon'} className='btn btn-danger w-100' type="submit" variant="contained" >
                                        Quay lại
                                    </Link>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type="submit" className='w-100' variant="contained" color="primary" disabled={loading}>
                                        {loading ? <CircularProgress size={24} /> : 'Sửa dữ liệu'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Customer List */}
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
                            <thead className="table-primary text-center">
                                <tr>

                                    {couponType === 'PERSONAL' && (
                                        <th>
                                            <Checkbox
                                                checked={selectedCustomers.length === customers.length && customers.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                    )}

                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} align="center">
                                            Không tìm thấy khách hàng!
                                        </td>
                                    </tr>
                                )}
                                {customers && customers.map((customer, index) => (
                                    <tr key={index}>
                                        {couponType === 'PERSONAL' && (
                                            <td>
                                                <Checkbox
                                                    checked={isSelected(customer.id)}
                                                    onChange={() => handleSelectCustomer(customer.id)}
                                                />
                                            </td>
                                        )}

                                        <td>{customer.firstName}</td>
                                        <td>{customer.phoneNumber}</td>
                                        <td>{customer.email}</td>
                                        <td>{formatDateCustomer(customer.dateOfBirth)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {couponType === 'PERSONAL' && (
                            <Grid item xs={12}>
                                <CouponImage
                                    onImagesUpload={handleImagesUpload}
                                    initialImages={images || []}
                                    storedImageUrl={storedImageUrl}
                                />
                            </Grid>
                        )}

                    </Grid>
                </Grid>
            </Box>
        </Container >
    );
};

export default UpdateCoupon;
