import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Sheet, Typography, Input, Button, Grid, FormControl, FormLabel, Breadcrumbs, Link, Box } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import { Password } from '@mui/icons-material';
import { putPassword } from '~/apis/client/apiAccountManager';
import { toast } from 'react-toastify';

const initialPasswords = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

export const UpdatePassWord = () => {
    const [passwords, setPasswords] = useState(initialPasswords);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };
    const passwordRegex = /^[^\s]{6,50}$/;

    const validateForm = () => {
        const errors = {};
    
        if (!passwords.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu cũ';
        }
    
        if (!passwords.newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (!passwordRegex.test(passwords.newPassword)) {
            errors.newPassword = 'Mật khẩu mới phải có từ 6 đến 50 kí tự!';
        } else if (passwords.newPassword === passwords.currentPassword) {
            errors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ';
        }
    
        if (passwords.newPassword !== passwords.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
        }
    
        setErrors(errors);
        setBackendErrors({}); 
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const isValid = validateForm(); 
        if (!isValid) return; 
    
        setIsLoading(true);
        setBackendErrors({}); 
    
        try {
            await putPassword(passwords, localStorage.getItem("userId"));
            toast.success('Đổi mật khẩu thành công');
            setPasswords(initialPasswords);
        } catch (error) {
            if (error.response && error.response.data.message) {
                const errorMessage = error.response.data.message;   
                if (errorMessage === 'Mật khẩu cũ không chính xác') {
                    setBackendErrors({ currentPassword: 'Mật khẩu cũ không chính xác' });
                } else if (errorMessage === 'Mật khẩu mới không được trùng với mật khẩu cũ') {
                    setBackendErrors({ newPassword: 'Mật khẩu mới không được trùng với mật khẩu cũ' });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Có lỗi xảy ra khi đổi mật khẩu');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <Grid sx={{ mb: 2 }}>
                <Sheet variant="outlined" sx={{ display: 'flex', flexDirection: 'column', borderRadius: 'md' }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ ml: "5px" }}>
                        <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Trang chủ
                        </Link>
                        <Link underline="hover" color="inherit" onClick={() => navigate("/my-account")}>
                            Tài khoản
                        </Link>
                        <Link underline="hover" color="inherit" onClick={() => navigate("/my-passWord")}>
                            Đổi mật khẩu
                        </Link>
                    </Breadcrumbs>
                </Sheet>
            </Grid>

            <Grid container spacing={2}>
                <Grid xs={12} md={3}>
                    <Sheet variant="outlined" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, borderRadius: 'md' }}>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-account")}>Thông tin tài khoản</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Tích lũy điểm</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Chia sẻ</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Đổi quà</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-order")}>Quản lý đơn hàng</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-address")}>Sổ địa chỉ</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>Sản phẩm bạn đã xem</Typography>
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-passWord")}>Đổi mật khẩu</Typography>
                    </Sheet>
                </Grid>

                <Grid xs={12} md={9}>
                    <Box p={0}>
                        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md' }}>
                                <Typography level="h5" fontWeight="lg" gutterBottom>ĐỔI MẬT KHẨU</Typography>

                                <Grid container spacing={2} ml={15}>
                                    <Grid xs={12} sm={9}>
                                        <Grid spacing={2}>
                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel required>Mật khẩu cũ</FormLabel>
                                                    <Input
                                                        name="currentPassword"
                                                        type="password"
                                                        placeholder="Mật khẩu cũ"
                                                        value={passwords.currentPassword}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.currentPassword && (
                                                        <Typography color="danger" variant="body2">{errors.currentPassword}</Typography>
                                                    )}
                                                    {backendErrors.currentPassword && (
                                                        <Typography color="danger" variant="body2">{backendErrors.currentPassword}</Typography>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel required>Mật khẩu mới</FormLabel>
                                                    <Input
                                                        name="newPassword"
                                                        type="password"
                                                        placeholder="Mật khẩu mới"
                                                        value={passwords.newPassword}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.newPassword && (
                                                        <Typography color="danger" variant="body2">{errors.newPassword}</Typography>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid xs={12} mb={2}>
                                                <FormControl>
                                                    <FormLabel required>Nhập lại mật khẩu</FormLabel>
                                                    <Input
                                                        name="confirmPassword"
                                                        type="password"
                                                        placeholder="Xác nhận mật khẩu"
                                                        value={passwords.confirmPassword}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.confirmPassword && (
                                                        <Typography color="danger" variant="body2">{errors.confirmPassword}</Typography>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid xs={6} sx={{ marginTop: 1 }}>
                                                <Button loading={isLoading} variant="soft" type="submit" color='primary' sx={{ marginRight: 1 }}>
                                                    Cập nhật
                                                </Button>
                                                {/* <Button variant="soft" color="danger" onClick={() => navigate("/")}>
                          Hủy
                        </Button> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Sheet>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}