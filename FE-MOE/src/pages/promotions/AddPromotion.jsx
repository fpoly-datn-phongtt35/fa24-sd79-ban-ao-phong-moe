import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postDiscount } from "~/apis/discountApi";
import Swal from "sweetalert2";
import { ProductList } from '~/components/promotion/ProductList';
import { Breadcrumbs, Button, Container, FormControl, FormHelperText, FormLabel, Grid, IconButton, Input, Link, Textarea, Typography } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from '@mui/icons-material/Add';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

export const AddPromotion = () => {
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState([]);

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

    const onSubmit = async (data) => {
        // Kiểm tra nếu ngày kết thúc không hợp lệ
        if (isEndDateInvalid) {
            Swal.fire("Lỗi", "Ngày kết thúc không được nhỏ hơn ngày bắt đầu!", "error");
            return; // Ngăn không cho tiếp tục nếu có lỗi
        }
    
        try {
            const response = await postDiscount({
                name: data.name,
                code: data.code,
                percent: data.percent,
                startDate: formatDate(data.startDate),
                endDate: formatDate(data.endDate),
                note: data.note,
                userId: localStorage.getItem("userId"),
                productIds: selectedProducts,
            });
    
            console.log("Response:", response);
    
            if (response.status === 201) {
                Swal.fire("Thành công", response.message, "success").then(() => {
                    navigate("/promotions");
                });
            } else {
                Swal.fire("Lỗi", "Không thể thêm đợt giảm giá", "error");
            }
        } catch (error) {
            console.error("Error adding discount:", error);
            Swal.fire("Lỗi", "Có lỗi xảy ra khi thêm đợt giảm giá", "error");
        }
    };
    

    // Theo dõi ngày bắt đầu và ngày kết thúc
    const startDate = watch("startDate");
    const endDate = watch("endDate");

    // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu
    const isEndDateInvalid = endDate && startDate && new Date(endDate) < new Date(startDate);

    return (
        <Container maxWidth="max-width" sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}>
            <Grid container spacing={2}>
                <Grid item xs={7}>
                    <Grid container spacing={2} alignItems="center" marginBottom={2} height={"50px"}>
                        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
                            <Link underline="hover" sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} color="inherit" onClick={() => navigate("/")}>
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                Trang chủ
                            </Link>
                            <Link underline="hover" sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} color="inherit" onClick={() => navigate("/promotions")}>
                                Quản lý đợt giảm giá
                            </Link>
                            <Typography sx={{ color: "text.white", cursor: "pointer" }}>Tạo đợt giảm giá</Typography>
                        </Breadcrumbs>
                    </Grid>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3} justifyContent="space-between">
                            <Grid xs={4}>
                                <FormControl error={!!errors?.name}>
                                    <FormLabel required>Tên đợt giảm giá</FormLabel>
                                    <Input placeholder="Nhập tên giảm giá..." fullWidth {...register("name", { required: true })} />
                                    {errors.name && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={4}>
                                <FormControl error={!!errors?.code}>
                                    <FormLabel required>Mã giảm giá</FormLabel>
                                    <Input placeholder="Nhập mã giảm giá..." fullWidth {...register("code", { required: true })} />
                                    {errors.code && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={4}>
                                <FormControl error={!!errors?.percent}>
                                    <FormLabel>Tỷ lệ giảm (%)</FormLabel>
                                    <Input type="number" placeholder="Nhập tỷ lệ giảm" {...register("percent", { required: true, min: 1, max: 100 })} />
                                    {errors.percent && <FormHelperText>Tỷ lệ giảm là bắt buộc và phải từ 1% đến 100%!</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} justifyContent="space-between">
                            <Grid md={6}>
                                <FormControl error={!!errors?.startDate}>
                                    <FormLabel>Ngày bắt đầu</FormLabel>
                                    <Input type="date" {...register("startDate", { required: true })} />
                                    {errors.startDate && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={6}>
                                <FormControl error={isEndDateInvalid || !!errors?.endDate}>
                                    <FormLabel>Ngày kết thúc</FormLabel>
                                    <Input type="date" {...register("endDate", { required: true })} />
                                    {isEndDateInvalid && <FormHelperText>Ngày kết thúc không được nhỏ hơn ngày bắt đầu!</FormHelperText>}
                                    {errors.endDate && !isEndDateInvalid && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <FormControl error={!!errors?.note}>
                                    <FormLabel>Mô tả</FormLabel>
                                    <Textarea minRows={3} maxRows={10} {...register("note")} placeholder="Nhập mô tả..."></Textarea>
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <Grid spacing={2}>
                                    <Grid size={6}>
                                        <Button startDecorator={<AddIcon />} type="submit" re>Thêm mới</Button>
                                        <IconButton onClick={() => navigate("/promotions")}>
                                            <DoDisturbOnIcon /> Hủy
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>

                <Grid item xs={5}>
                    {/* Pass selectedProducts and setSelectedProducts to ProductList */}
                    <ProductList selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
                </Grid>
            </Grid>
        </Container>
    );
};
