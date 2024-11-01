// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { postDiscount } from "~/apis/discountApi"; // Kiểm tra đường dẫn API đúng không
// import Swal from "sweetalert2";
// import { Breadcrumbs, Button, Container, FormControl, FormHelperText, FormLabel, Grid, IconButton, Input, Link, Textarea, Typography } from "@mui/joy";
// import HomeIcon from "@mui/icons-material/Home";
// import AddIcon from '@mui/icons-material/Add';
// import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

// export const AddPromotion = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const navigate = useNavigate();

//   // Hàm formatDate để định dạng ngày tháng (tùy theo yêu cầu của bạn)
//   const formatDate = (dateString, time = "00:00:00") => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year} | ${time}`;
//   };

//   const onSubmit = async (data) => {
//     try {
//       // Gọi API postDiscount để thêm đợt giảm giá
//       const response = await postDiscount({
//         name: data.name,
//         code: data.code,
//         percent: data.promotionValue, // Đảm bảo tỷ lệ giảm giá là số nguyên
//         startDate: formatDate(data.startDate),
//         endDate: formatDate(data.endDate),
//         note: data.note,
//         userId: localStorage.getItem("userId"), // Đảm bảo lấy đúng userId từ localStorage
//       });

//       if (response && response.status === 200) {  // Kiểm tra nếu phản hồi thành công   
//         Swal.fire("Thành công", "Đợt giảm giá đã được thêm!", "success");
//         navigate("/promotions");  // Quay lại trang danh sách sau khi thêm thành công
//       } else {
//         Swal.fire("Lỗi", "Không thể thêm đợt giảm giá", "error");
//       }
//     } catch (error) {
//       console.error("Error adding discount:", error);
//       Swal.fire("Lỗi", "Có lỗi xảy ra khi thêm đợt giảm giá", "error");
//     }
//   };

//   return (
//     <Container maxWidth="max-width"
//       sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}>

//       <Grid
//         container
//         spacing={2}
//         alignItems="center"
//         marginBottom={2}
//         height={"50px"}
//       >
//         <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
//           <Link
//             underline="hover"
//             sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//             color="inherit"
//             onClick={() => navigate("/")}
//           >
//             <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//             Trang chủ
//           </Link>
//           <Link
//             underline="hover"
//             sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//             color="inherit"
//             onClick={() => navigate("/promotions")}
//           >
//             Quản lý đợt giảm giá
//           </Link>
//           <Typography sx={{ color: "text.white", cursor: "pointer" }}>
//             Tạo đợt giảm giá
//           </Typography>
//         </Breadcrumbs>
//       </Grid>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={3} justifyContent="space-between">
//           <Grid xs={4}>
//             <FormControl error={!!errors?.name}>
//               <FormLabel required>Tên đợt giảm giá</FormLabel>
//               <Input
//                 placeholder="Nhập tên giảm giá..."
//                 fullWidth
//                 {...register("name", { required: true })}
//               />
//               {/* {errors.name && <span className="text-danger">Tên đợt giảm giá là bắt buộc</span>} */}
//               {errors.name && (
//                 <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
//               )}
//             </FormControl>
//           </Grid>
//           <Grid xs={4}>
//             <FormControl error={!!errors?.code}>
//               <FormLabel required>Mã giảm giá</FormLabel>
//               <Input
//                 placeholder="Nhập mã giảm giá..."
//                 fullWidth
//                 {...register("code", { required: true })}
//               />
//               {/* {errors.name && <span className="text-danger">Tên đợt giảm giá là bắt buộc</span>} */}
//               {errors.code && (
//                 <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
//               )}
//             </FormControl>
//           </Grid>
//           <Grid xs={4}>
//             <FormControl error={!!errors?.percent}>
//               <FormLabel>Tỷ lệ giảm (%)</FormLabel>
//               <Input
//                 type="number"
//                 placeholder="Nhập tỷ lệ giảm"
//                 {...register("promotionValue", { required: true, min: 1, max: 100 })}
//               />
//               {errors.percent && (
//                 <FormHelperText>Tỷ lệ giảm là bắt buộc và phải từ 1% đến 100%!</FormHelperText>
//               )}
//             </FormControl>
//           </Grid>
//         </Grid>
//         <Grid container spacing={3} justifyContent="space-between">
//           <Grid md={6}>
//             <FormControl error={!!errors?.startDate}>
//               <FormLabel>Ngày bắt đầu</FormLabel>
//               <Input
//                 type="date"
//                 {...register("startDate", { required: true })}
//               />
//               {errors.startDate && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
//             </FormControl>
//           </Grid>
//           <Grid xs={6}>
//             <FormControl error={!!errors?.endDate}>
//               <FormLabel>Ngày kết thúc</FormLabel>
//               <Input
//                 type="date"
//                 {...register("endDate", { required: true })}
//               />
//               {errors.endDate && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
//             </FormControl>
//           </Grid>
//           <Grid xs={12}>
//             <FormControl error={!!errors?.note}>
//               <FormLabel>Mô tả</FormLabel>
//               <Textarea
//                 minRows={3}
//                 maxRows={10}
//                 {...register("note")}
//                 placeholder="Nhập mô tả..."
//               ></Textarea>
//             </FormControl>
//           </Grid>
//           <Grid xs={12}>
//             <Grid spacing={2}>
//               <Grid size={6}>
//                 <Button startDecorator={<AddIcon />} type="submit">
//                   Thêm mới
//                 </Button>
//                 <IconButton onClick={() => navigate("/promotions")}>
//                   <DoDisturbOnIcon /> Hủy
//                 </IconButton>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// };


// import { useForm } from "react-hook-form";
// import { useNavigate, useParams } from "react-router-dom";
// import { detailDiscount, putDiscount } from "~/apis/discountApi";
// import Swal from "sweetalert2";
// import { useEffect, useState } from "react";
// import { Breadcrumbs, Button, Container, FormControl, FormHelperText, FormLabel, Grid, IconButton, Input, Link, Textarea, Typography } from "@mui/joy";
// import HomeIcon from "@mui/icons-material/Home";
// import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
// import EditIcon from '@mui/icons-material/Edit';
// import { ProductUpdate } from "~/components/promotion/ProductUpdate";

// export const UpdatePromotion = () => {
//   const { register, handleSubmit, setValue, formState: { errors } } = useForm();
//   const navigate = useNavigate();
//   const { id } = useParams();
//    const [selectedProducts, setSelectedProducts] = useState([]);

//   const formatDate = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');

//     return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
//   };
//   //Hàm lấy thông tin chi tiết để cập nhật
//   useEffect(() => {
//     const fetchPromotionDetail = async () => {
//       try {
//         const response = await detailDiscount(id);
//         if (response && response.status === 200) {
//           const promotionData = response.data;

//           // Đặt giá trị biểu mẫu với dữ liệu đã lấy
//           setValue("name", promotionData.name);
//           setValue("code", promotionData.code);
//           setValue("percent", promotionData.percent); // Đảm bảo đúng tên thuộc tính
//           setValue('startDate', promotionData.startDate.split('T')[0]); // Lấy phần YYYY-MM-DD
//           setValue('endDate', promotionData.endDate.split('T')[0]); // Lấy phần YYYY-MM-DD
//           setValue("note", promotionData.note);
//         } else {
//           Swal.fire("Lỗi", "Không thể tải thông tin đợt giảm giá", "error");
//         }
//       } catch (error) {
//         console.error("Error fetching promotion details:", error);
//         Swal.fire("Lỗi", "Có lỗi xảy ra khi tải thông tin đợt giảm giá", "error");
//       }
//     };

//     fetchPromotionDetail();
//   }, [id, setValue]);



//   const onSubmit = async (data) => {
//     try {
//       const response = await putDiscount(id, {
//         name: data.name,
//         code: data.code,
//         percent: data.percent,
//         startDate: formatDate(data.startDate),
//         endDate: formatDate(data.endDate),
//         note: data.note,
//         userId: localStorage.getItem("userId"), // Đảm bảo lấy đúng userId từ localStorage
//       });

//       if (response && response.status === 200) {
//         Swal.fire("Thành công", "Đợt giảm giá đã được cập nhật!", "success");
//         navigate("/promotions"); // Redirect to promotions list after successful update
//       } else {
//         Swal.fire("Lỗi", "Không thể cập nhật đợt giảm giá", "error");
//       }
//     } catch (error) {
//       console.error("Error updating discount:", error);
//       Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật đợt giảm giá", "error");
//     }
//   };

//   return (
//     <Container maxWidth="max-width" sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}>
//       <Grid container spacing={2}>
//         <Grid item xs={7}>
//           <Grid container spacing={2} alignItems="center" marginBottom={2} height={"50px"}>
//             <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
//               <Link
//                 underline="hover"
//                 sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//                 color="inherit"
//                 onClick={() => navigate("/")}
//               >
//                 <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//                 Trang chủ
//               </Link>
//               <Link
//                 underline="hover"
//                 sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//                 color="inherit"
//                 onClick={() => navigate("/promotions")}
//               >
//                 Quản lý đợt giảm giá
//               </Link>
//               <Typography sx={{ color: "text.white", cursor: "pointer" }}>
//                 Cập nhật đợt giảm giá
//               </Typography>
//             </Breadcrumbs>
//           </Grid>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Grid container spacing={3} justifyContent="space-between">
//               <Grid xs={4}>
//                 <FormControl error={!!errors?.name}>
//                   <FormLabel required>Tên đợt giảm giá</FormLabel>
//                   <Input
//                     placeholder="Nhập tên sản phẩm..."
//                     fullWidth
//                     {...register("name", { required: true })}
//                   />
//                   {/* {errors.name && <span className="text-danger">Tên đợt giảm giá là bắt buộc</span>} */}
//                   {errors.name && (
//                     <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid xs={4}>
//                 <FormControl error={!!errors?.code}>
//                   <FormLabel required>Mã đợt giảm giá</FormLabel>
//                   <Input
//                     placeholder="Nhập mã sản phẩm..."
//                     fullWidth
//                     {...register("code", { required: true })}
//                   />
//                   {/* {errors.name && <span className="text-danger">Tên đợt giảm giá là bắt buộc</span>} */}
//                   {errors.code && (
//                     <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid xs={4}>
//                 <FormControl error={!!errors?.percent}>
//                   <FormLabel>Tỷ lệ giảm (%)</FormLabel>
//                   <Input
//                     type="number"
//                     placeholder="Nhập tỷ lệ giảm"
//                     {...register("percent", { required: true, min: 1, max: 100 })}
//                   />
//                   {errors.persent && (
//                     <FormHelperText>Tỷ lệ giảm là bắt buộc và phải từ 1% đến 100%!</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//             </Grid>
//             <Grid container spacing={3} justifyContent="space-between">
//               <Grid md={4}>
//                 <FormControl error={!!errors?.startDate}>
//                   <FormLabel>Ngày bắt đầu</FormLabel>
//                   <Input
//                     type="date"
//                     {...register("startDate", { required: true })}
//                   />
//                   {errors.startDate && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
//                 </FormControl>
//               </Grid>
//               <Grid xs={4}>
//                 <FormControl error={!!errors?.endDate}>
//                   <FormLabel>Ngày kết thúc</FormLabel>
//                   <Input
//                     type="date"
//                     {...register("endDate", { required: true })}
//                   />
//                   {errors.endDate && <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>}
//                 </FormControl>
//               </Grid>
//               <Grid xs={12}>
//                 <FormControl error={!!errors?.note}>
//                   <FormLabel>Mô tả</FormLabel>
//                   <Textarea
//                     minRows={3}
//                     maxRows={10}
//                     {...register("note")}
//                     placeholder="Nhập mô tả..."
//                   ></Textarea>
//                 </FormControl>
//               </Grid>


//               <Grid xs={12}>
//                 <Grid spacing={2}>
//                   <Grid size={6}>
//                     <Button startDecorator={<EditIcon />} type="submit">
//                       Cập nhật
//                     </Button>
//                     <IconButton onClick={() => navigate("/promotions")}>
//                       <DoDisturbOnIcon /> Hủy
//                     </IconButton>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </form>
//         </Grid>
//         <Grid item xs={5}>
//           {/* {<ProductUpdate/>}  */}
//           <ProductUpdate selectedProducts = {selectedProducts.length > 0 
//                             ? `Danh sách ID sản phẩm đã chọn: ${selectedProducts.join(', ')}`
//                             : 'Không có sản phẩm nào được chọn.'}/>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };
