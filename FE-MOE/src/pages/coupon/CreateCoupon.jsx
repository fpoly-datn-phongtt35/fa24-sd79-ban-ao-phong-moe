import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Link, Button, Box, Grid, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, IconButton, InputAdornment, Stack, Pagination } from '@mui/material';
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postCoupon, postCouponImage } from '~/apis/couponApi';
import { useNavigate } from 'react-router-dom';
import { faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import CouponImage from '~/components/common/CouponImage';
import { fetchAllCustomer, searchKeywordAndDate } from '~/apis/customerApi';
import { Breadcrumbs } from '@mui/joy';
import HomeIcon from "@mui/icons-material/Home";
import { CircularProgress } from '@mui/material';


const CreateCoupon = () => {
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm();
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
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [page, keyword, gender, birth]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };


    const handleDiscountTypeChange = (type) => {
        setDiscountType(type);
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
            console.log(response);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        }
    };

    const handleSelectAll = (event) => {

        if (event.target.checked) {
            const allCustomerIds = customers.map(customer => customer.id);
            setSelectedCustomers(allCustomerIds);
            setSelectedCustomersError('');
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
                                        label="Giá trị giảm tối đa cho đơn hàng"
                                        type="number"
                                        {...register('maxValue', {
                                            required: 'Chưa nhập giá trị tối đa',
                                            min: {
                                                value: 0.01,
                                                message: 'Giá trị tổi đa phải lớn hơn 0',
                                            },
                                            max: {
                                                value: 999999999999999,
                                                message: 'Giá trị giảm tối đa phải nhỏ hơn 999999999999999',

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
                                                message: 'Điều kiện giảm phải lớn 0',
                                            },
                                            max: {
                                                value: 999999999999999,
                                                message: 'Điều kiện phải nhỏ hơn 999999999999999',

                                            },
                                            validate: value =>
                                                parseFloat(value) >= parseFloat(watch('maxValue')) ||
                                                'Điều kiện phải lớn hơn giá trị giảm tối đa',
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
                                {...register('startDate', { required: 'Chưa nhập ngày bắt đầu' })}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />


                            <TextField
                                variant="outlined"
                                label="Đến ngày"
                                type="date"
                                {...register('endDate', {
                                    required: 'Chưa nhập ngày kết thúc',
                                    validate: value =>
                                        new Date(value) > new Date(watch('startDate')) || 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
                                })}
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

                    <Grid item xs={6}>



                        <TextField
                            variant="outlined"
                            label="Tìm kiếm khách hàng"
                            fullWidth
                            margin="normal"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />

                        <table className="table table-bordered table-hover">
                            <thead className="table-primary text-center">
                                <tr>

                                    {type === 'PERSONAL' ? (
                                        <th>
                                            <Checkbox
                                                checked={selectedCustomers.length === customers.length && customers.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                    ) : (
                                        <th style={{ width: '1%' }}></th>
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
                                        {type === 'PERSONAL' ? (
                                            <td>
                                                <Checkbox
                                                    checked={isSelected(customer.id)}
                                                    onChange={() => handleSelectCustomer(customer.id)}
                                                />
                                            </td>
                                        ) : (
                                            <td></td>
                                        )}
                                        <td>{customer.firstName}</td>
                                        <td>{customer.phoneNumber}</td>
                                        <td>{customer.email}</td>
                                        <td>{formatDateCustomer(customer.dateOfBirth)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedCustomersError && (
                            <Typography color="error">{selectedCustomersError}</Typography>
                        )}
                        <Box mt={2} display="flex" justifyContent="center" >
                            {totalPages > 1 && (
                                <Stack spacing={2}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant="outlined"
                                        shape="rounded"
                                    />
                                </Stack>
                            )}
                        </Box>


                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default CreateCoupon;
