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
import { faPercent, faDollarSign, faCamera } from '@fortawesome/free-solid-svg-icons';
import CouponImage from '~/components/common/CouponImage';
import { fetchAllCustomer } from '~/apis/customerApi';

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
    const type = watch('type', 'public');

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

    const handleImagesUpload = (files) => {
        setImages(files);
    };


    const onSubmit = async (data) => {
        const coupon = {
            code: data.code,
            name: data.name,
            discountValue: data.discountValue,
            discountType: discountType === 'percentage' ? 'percentage' : 'fixed_amount',
            maxValue: data.maxValue,
            quantity: data.quantity,
            conditions: data.conditions,
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            type: data.type === 'public' ? 'public' : 'personal',
            description: data.description,
            userId: localStorage.getItem("userId"),
        };

        console.log(coupon);

        await updateCoupon(id, coupon).then(async (response) => {
            console.log(response);
            await deleteCouponImage(response);
            let formData = new FormData();
            formData.append("couponID", response);
            formData.append("images", images[0]);
            console.log(images);
            await postCouponImage(formData);
            navigate("/coupon");
        });
    };

    useEffect(() => {
        const fetchCouponDetail = async () => {
            try {
                const coupon = await detailCoupon(id);
                const couponData = coupon.data;           
                console.log("Fetched coupon data:", couponData);         
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
                setStoredImageUrl(couponData.imageUrl || '');       
                if (Array.isArray(couponData.customers)) {
                    const customerIds = couponData.customers.map(customer => customer.id);
                    setSelectedCustomers(customerIds);
                    console.log("Selected Customers:", customerIds);
                } else {
                    setSelectedCustomers([]);
                    console.log("No customers found, Selected Customers is empty.");
                }

            } catch (error) {
                console.error("Error fetching coupon details: ", error);
            }
        };

        fetchCouponDetail();
        handleSetCustomer(); 

    }, [id, setValue]);



    const formatDateCustomer = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };


    const handleSetCustomer = async () => {
        const response = await fetchAllCustomer();
        setCustomers(response.data.content);
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
        console.log('Selecting customer ID:', customerId);
        setSelectedCustomers((prevSelected) => {
            if (prevSelected.includes(customerId)) {
                return prevSelected.filter(id => id !== customerId);
            } else {
                return [...prevSelected, customerId];
            }
        });
    };


    const isSelected = (customerId) => {
        const selected = selectedCustomers.includes(customerId);
        return selected;
    };


    const filteredCustomers = customers.filter((customer) =>
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
                                                <FormControlLabel value="PUBLIC" control={<Radio />} label="Công khai" />
                                                <FormControlLabel value="PERSONAL" control={<Radio />} label="Cá nhân" />
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

                            <Grid item xs={12}>
                                <CouponImage
                                    onImagesUpload={handleImagesUpload}
                                    initialImages={[]}
                                    storedImageUrl={storedImageUrl}
                                />
                            </Grid>

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
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} align="center">Không tìm thấy khách hàng!</td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer, index) => (
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </Grid>
                </Grid>
            </Box>
        </Container >
    );
};

export default UpdateCoupon;
