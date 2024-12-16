import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { detailDiscount, putDiscount, fetchAllDiscounts } from "~/apis/discountApi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Breadcrumbs, Button, Container, FormControl, FormHelperText, FormLabel, Grid, Input, Link, Textarea, Typography } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import { ProductUpdate } from "~/components/promotion/ProductUpdate";

const formatDateForBackend = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
};

export const UpdatePromotion = () => {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const isEndDateInvalid = endDate && startDate && new Date(endDate) < new Date(startDate);

  const fetchPromotionDetail = async () => {
    try {
      const response = await detailDiscount(id);
      if (response && response.status === 200) {
        const promotionData = response.data;
        setValue("name", promotionData.name);
        setValue("code", promotionData.code);
        setValue("percent", promotionData.percent);

        // Chuyển đổi ngày giờ từ UTC sang datetime-local
        const toLocalDateTime = (dateString) => {
          const date = new Date(dateString);
          const offset = date.getTimezoneOffset() * 60000;
          const localDate = new Date(date.getTime() - offset);
          return localDate.toISOString().slice(0, 16);
        };

        setValue("startDate", toLocalDateTime(promotionData.startDate));
        setValue("endDate", toLocalDateTime(promotionData.endDate));

        setValue("note", promotionData.note);
        setSelectedProducts(promotionData.listIdProduct || []);
      } else {
        Swal.fire("Lỗi", "Không thể tải thông tin đợt giảm giá", "error");
      }
    } catch (error) {
      console.error("Error fetching promotion details:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi tải thông tin đợt giảm giá", "error");
    }
  };

  useEffect(() => {
    fetchPromotionDetail();
  }, []);

  const onSubmit = async (data) => {
    // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu
    if (new Date(data.endDate) < new Date(data.startDate)) {
      Swal.fire("Lỗi", "Ngày kết thúc không được nhỏ hơn ngày bắt đầu!", "error");
      return;
    }

    setLoading(true);

    try {
      const allDiscountsResponse = await fetchAllDiscounts();
      const allDiscounts = allDiscountsResponse.data.content || [];

      // Đếm số đợt giảm giá đang hoạt động
      const activeDiscounts = allDiscounts.filter((discount) => {
        const now = new Date();
        return new Date(discount.startDate) <= now && new Date(discount.endDate) >= now;
      });

      const isDuplicate = allDiscounts.some((discount) => {
        if (discount.id === parseInt(id)) return false;

        const discountStartDate = new Date(discount.startDate);
        const discountEndDate = new Date(discount.endDate);
        const newStartDate = new Date(data.startDate);
        const newEndDate = new Date(data.endDate);

        return (
          (newStartDate >= discountStartDate && newStartDate <= discountEndDate) ||
          (newEndDate >= discountStartDate && newEndDate <= discountEndDate) ||
          (newStartDate <= discountStartDate && newEndDate >= discountEndDate)
        );
      });

      // Nếu đợt này là duy nhất đang hoạt động
      const isOnlyActive = activeDiscounts.length === 1 && activeDiscounts[0].id === parseInt(id);

      if (isDuplicate && !isOnlyActive) {
        Swal.fire("Lỗi", "Ngày bắt đầu hoặc ngày kết thúc trùng với đợt giảm giá khác!", "error");
        return;
      }

      const payload = {
        name: data.name,
        code: data.code,
        percent: data.percent,
        startDate: formatDateForBackend(data.startDate),
        endDate: formatDateForBackend(data.endDate),
        note: data.note,
        userId: localStorage.getItem("userId"),
        productIds: selectedProducts,
      };

      const response = await putDiscount(id, payload);

      if (response && response.status === 200) {
        Swal.fire("Thành công", "Đợt giảm giá đã được cập nhật!", "success");
        navigate("/promotions");
      } else {
        Swal.fire("Lỗi", "Không thể cập nhật đợt giảm giá", "error");
      }
    } catch (error) {
      console.error("Error updating discount:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật đợt giảm giá", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="max-width" sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
            <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Trang chủ
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/promotions")}>
              Quản lý đợt giảm giá
            </Link>
            <Typography sx={{ color: "text.white" }}>Cập nhật đợt giảm giá</Typography>
          </Breadcrumbs>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Tên và mã đợt giảm giá */}
              <Grid item xs={4}>
                <FormControl error={!!errors?.name}>
                  <FormLabel required>Tên đợt giảm giá</FormLabel>
                  <Input fullWidth {...register("name", { required: true })} />
                  {errors.name && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl error={!!errors?.code}>
                  <FormLabel required>Mã đợt giảm giá</FormLabel>
                  <Input fullWidth {...register("code", { required: true })} />
                  {errors.code && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl error={!!errors?.percent}>
                  <FormLabel>Tỷ lệ giảm (%)</FormLabel>
                  <Input type="number" {...register("percent", { required: true, min: 1, max: 100 })} />
                  {errors.percent && <FormHelperText>Tỷ lệ giảm phải từ 1% đến 100%!</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Ngày và giờ bắt đầu */}
              <Grid item md={6}>
                <FormControl error={!!errors?.startDate}>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <Input type="datetime-local" {...register("startDate", { required: true })} />
                  {errors.startDate && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Ngày và giờ kết thúc */}
              <Grid item md={6}>
                <FormControl error={isEndDateInvalid || !!errors?.endDate}>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <Input type="datetime-local" {...register("endDate", { required: true })} />
                  {isEndDateInvalid && <FormHelperText>Ngày kết thúc không được nhỏ hơn ngày bắt đầu!</FormHelperText>}
                  {errors.endDate && !isEndDateInvalid && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Mô tả */}
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea {...register("note")} />
                </FormControl>
              </Grid>

              {/* Nút hành động */}
              <Grid item xs={12}>
                <Button startDecorator={!loading && <EditIcon />} type="submit" disabled={loading}>
                  {loading ? <CircularProgress size="sm" /> : "Cập nhật"}
                </Button>
                <Button startDecorator={<DoDisturbOnIcon />} color="danger" onClick={() => navigate("/promotions")} sx={{ marginLeft: "10px" }}>
                  Hủy
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        {/* Phần sản phẩm */}
        <Grid item xs={5}>
          <ProductUpdate selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
        </Grid>
      </Grid>
    </Container>
  );
};
