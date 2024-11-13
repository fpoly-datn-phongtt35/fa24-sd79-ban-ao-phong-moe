import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Link, Button, Box, Grid, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, IconButton, InputAdornment, Stack, Pagination, Breadcrumbs } from '@mui/material';
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postCoupon, postCouponImage } from '~/apis/couponApi';
import { useNavigate } from 'react-router-dom';
import { faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import CouponImage from '~/components/common/CouponImage';
import { fetchAllCustomer, searchKeywordAndDate } from '~/apis/customerApi';
import HomeIcon from "@mui/icons-material/Home";
import { CircularProgress } from '@mui/material';
import CustomerTableCreate from '~/components/coupon/CustomerTableCreate';

const CreateCoupon = () => {
    const { register, handleSubmit, watch, getValues, clearErrors, formState: { errors }, control, setValue } = useForm();
    const [discountType, setDiscountType] = useState('');
    const [images, setImages] = useState(null);
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [discountTypeError, setDiscountTypeError] = useState('');
    const [imagesError, setImagesError] = useState('');
    const [selectedCustomersError, setSelectedCustomersError] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [keyword, setKeyword] = useState('');
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState('');
    const conditions = watch('conditions');
    const type = watch('type', 'PUBLIC');
    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        handleSetCustomer();
    }, [page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [keyword, gender, birth]);

    useEffect(() => {
        clearErrors('conditions');
    }, [discountType, conditions, clearErrors]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleDiscountTypeChange = (type) => {
        setDiscountType(type);
        if (type === 'FIXED_AMOUNT') {
            setValue('maxValue', 0);
        }
        setDiscountTypeError('');
    };

    const handleImagesUpload = (files) => {
        setImages(files);
        setImagesError('');
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const res = await searchKeywordAndDate(keyword || '', gender || '', birth || '');
            setCustomers(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        let isValid = true;

        if (!discountType) {
            setDiscountTypeError('Chưa chọn loại giảm giá.');
            isValid = false;
        } else {
            setDiscountTypeError('');
        }

        if (data.type === 'PERSONAL' && (!images || images.length === 0)) {
            setImagesError('Chưa chọn ảnh.');
            isValid = false;
        } else {
            setImagesError('');
        }

        if (data.type === 'PERSONAL' && (!selectedCustomers || selectedCustomers.length === 0)) {
            setSelectedCustomersError('Phải chọn ít nhất một khách hàng cho phiếu giảm giá cá nhân.');
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
            maxValue: data.maxValue || 0,
            quantity: data.quantity,
            usageCount : 0,
            conditions: data.conditions,
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            type: data.type,
            description: data.description,
            userId: localStorage.getItem("userId"),
            customerIds: data.type === 'PERSONAL' ? selectedCustomers : null,
        };

        try {
            setLoading(true);
            const response = await postCoupon(coupon);
            if (data.type === 'PERSONAL' && images && images.length > 0) {
                let formData = new FormData();
                formData.append("couponID", response);

                images.forEach((image, index) => {
                    formData.append("images", image);
                });

                await postCouponImage(formData);
            }

            navigate("/coupon");
        } catch (error) {
            console.error("Error creating coupon or uploading images:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateCustomer = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const handleSetCustomer = async () => {
        try {
            const response = await fetchAllCustomer(page - 1, pageSize);
            setCustomers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        }
    };

    const handleSelectAll = async (event) => {
        if (!isAllSelected) {
            try {
                let allCustomers = [];
                const response = await fetchAllCustomer(0, pageSize);
                const totalPages = response.data.totalPages;
                for (let i = 0; i < totalPages; i++) {
                    const pageResponse = await fetchAllCustomer(i, pageSize);
                    allCustomers = allCustomers.concat(pageResponse.data.content);
                }

                const allCustomerIds = allCustomers.map(customer => customer.id);
                setSelectedCustomers(allCustomerIds);
                setSelectedCustomersError('');
            } catch (error) {
                console.error("Failed to fetch all customers:", error);
            }
        } else {
            setSelectedCustomers([]);
            setSelectedCustomersError('Phải chọn ít nhất một khách hàng cho phiếu giảm giá cá nhân.');
        }
    };

    const handleSelectCustomer = (customerId) => {
        setSelectedCustomers((prevSelected) => {
            let updatedSelected;
            if (prevSelected.includes(customerId)) {
                updatedSelected = prevSelected.filter(id => id !== customerId);
            } else {
                updatedSelected = [...prevSelected, customerId];
            }

            if (updatedSelected.length > 0) {
                setSelectedCustomersError('');
            } else {
                setSelectedCustomersError('Phải chọn ít nhất một khách hàng cho phiếu giảm giá cá nhân.');
            }

            return updatedSelected;
        });
    };

    const isSelected = (customerId) => selectedCustomers.includes(customerId);

    const isAllSelected = customers.length > 0 && customers.every(customer => selectedCustomers.includes(customer.id));


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
                                    required: 'Chưa nhập mã giảm giá',
                                    minLength: {
                                        value: 5,
                                        message: 'Mã phải có ít nhất 5 ký tự',
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'Mã không được quá 10 ký tự',
                                    },
                                })}
                                error={!!errors.code}
                                helperText={errors.code?.message}
                            />
                            <TextField
                                variant="outlined"
                                label="Tên phiếu giảm giá"
                                {...register('name', {
                                    required: 'Chưa nhập tên phiếu giảm giá',
                                    minLength: {
                                        value: 5,
                                        message: 'Tên phải có ít nhất 5 ký tự',
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Tên không được quá 100 ký tự',
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
                                            required: 'Chưa nhập giá trị giảm',
                                            min: {
                                                value: 0.01,
                                                message: 'Giá trị phải lớn hơn 0',
                                            },
                                            max: {
                                                value: 999999999999999,
                                                message: 'Giá trị phải nhỏ hơn 999999999999999',
                                            },
                                            validate: value => {
                                                if (discountType === 'PERCENTAGE' && value > 100) {
                                                    return 'Giá trị phần trăm không thể lớn hơn 100';
                                                }
                                                return true;
                                            }
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
                                        disabled={discountType === 'FIXED_AMOUNT'}
                                        variant="outlined"
                                        label="Giá trị giảm tối đa cho đơn hàng"
                                        type="number"
                                        {...register('maxValue', {
                                            required: 'Chưa nhập giá trị tối đa',
                                            min: discountType === 'PERCENTAGE' ? {
                                                value: 0.01,
                                                message: 'Giá trị tối đa phải lớn hơn 0',
                                            } : undefined,
                                            max: {
                                                value: 999999999999999,
                                                message: 'Giá trị giảm tối đa phải nhỏ hơn 999999999999999',
                                            },
                                            validate: value => {
                                                if (discountType === 'PERCENTAGE') {
                                                    const discountValue = getValues('discountValue');
                                                    const conditionsValue = getValues('conditions');                                                                      
                                                    const minRequiredMaxValue = (discountValue / 100) * conditionsValue;
                                
                                                    if (value < minRequiredMaxValue) {
                                                        return `Giá trị giảm tối đa phải lớn hơn hoặc bằng ${minRequiredMaxValue.toFixed(2)} cho điều kiện đơn hàng hiện tại`;
                                                    }
                                                }
                                                return true;
                                            },
                                        })}
                                        InputLabelProps={{ shrink: true }}
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
                                            required: 'Chưa nhập số lượng sử dụng',
                                            min: {
                                                value: 1,
                                                message: 'Số lượng sử dụng phải lớn hơn 0',
                                            },
                                            max: {
                                                value: 99999999,
                                                message: 'Số lượng phải nhỏ hơn 99999999',

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
                                            required: 'Chưa nhập điều kiện để thực hiện sử dụng',
                                            min: {
                                                value: 0.01,
                                                message: 'Điều kiện phải lớn hơn 0',
                                            },
                                            max: {
                                                value: 999999999999999,
                                                message: 'Điều kiện phải nhỏ hơn 999999999999999',
                                            },
                                            validate: (value) => {
                                                const discountValue = getValues('discountValue');
                                                const numericalValue = parseFloat(value);

                                                if (discountType === 'FIXED_AMOUNT' && numericalValue < discountValue) {
                                                    return 'Điều kiện phải lớn hơn hoặc bằng giá trị giảm';
                                                } else if (discountType === 'PERCENTAGE' && numericalValue < (discountValue / 100) * 10000) {
                                                    return 'Điều kiện phải lớn hơn hoặc bằng giá trị giảm (tính theo phần trăm)';
                                                }
                                                return true;
                                            }
                                        })}
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.conditions}
                                        helperText={errors.conditions?.message}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} >
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Thời gian bắt đầu"
                                        type="datetime-local"
                                        {...register('startDate', { required: 'Chưa nhập ngày bắt đầu' })}
                                        error={!!errors.startDate}
                                        helperText={errors.startDate?.message}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Thời gian kết thúc"
                                        type="datetime-local"
                                        {...register('endDate', {
                                            required: 'Chưa nhập ngày kết thúc',
                                            validate: (value) => {
                                                const startDate = new Date(watch('startDate'));
                                                const endDate = new Date(value);
                                                return endDate > startDate || 'Ngày và giờ kết thúc phải lớn hơn ngày và giờ bắt đầu';
                                            },
                                        })}
                                        error={!!errors.endDate}
                                        helperText={errors.endDate?.message}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    marginTop: '10px',
                                }}
                            >
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item style={{ marginRight: '40%' }}>
                                        <FormControl component="fieldset" error={!!errors.type}>
                                            <FormLabel component="legend">Kiểu</FormLabel>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <Controller
                                            name="type"
                                            control={control}
                                            defaultValue="PUBLIC"
                                            rules={{ required: 'Chưa chọn kiểu dữ liệu' }}
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
                                        message: 'Mô tả không quá 255 ký tự',
                                    },
                                })}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            {imagesError && (
                                <Typography color="error">{imagesError}</Typography>
                            )}

                            {type === 'PERSONAL' && (
                                <Grid item xs={12} container justifyContent="center">

                                    <CouponImage onImagesUpload={handleImagesUpload} />
                                </Grid>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button onClick={() => navigate("/coupon")} className='w-100' type="submit" variant="contained" color="error" >
                                        Quay lại
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type="submit" className='w-100' variant="contained" color="primary" disabled={loading}>
                                        {loading ? <CircularProgress size={24} /> : 'Thêm mới'}
                                    </Button>
                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>

                    <CustomerTableCreate
                        keyword={keyword}
                        setKeyword={setKeyword}
                        customers={customers}
                        type={type}
                        isAllSelected={isAllSelected}
                        handleSelectAll={handleSelectAll}
                        isSelected={isSelected}
                        handleSelectCustomer={handleSelectCustomer}
                        formatDateCustomer={formatDateCustomer}
                        selectedCustomersError={selectedCustomersError}
                        totalPages={totalPages}
                        page={page}
                        handlePageChange={handlePageChange}
                    />
                </Grid>
            </Box>
        </Container>
    );
};

export default CreateCoupon;
