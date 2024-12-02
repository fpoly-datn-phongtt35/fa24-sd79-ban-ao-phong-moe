import React, { useState } from "react";
import { postSupportRequest } from "~/apis/supportApi"; // Đường dẫn đến file service API
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Typography,
  Grid,
  Divider,
} from "@mui/joy";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { toast } from "react-toastify";

export const Contact = () => {
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    message: "",
  });
  const validateInputs = () => {
    let tempErrors = {};
    if (!formData.hoTen) tempErrors.hoTen = "Họ tên là bắt buộc.";
    if (!formData.email) tempErrors.email = "Email là bắt buộc.";
    if (!formData.sdt) tempErrors.sdt = "Số điện thoại là bắt buộc.";
    if (!formData.message) tempErrors.message = "Lời nhắn là bắt buộc.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };
    const phoneRegex = /^0\d{9,11}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    switch (name) {

      case 'sdt':
        if (!phoneRegex.test(value)) {
          newErrors.sdt = "Số điện thoại phải bắt đầu bằng 0 và có từ 10-12 chữ số, không chứa ký tự đặc biệt";
        } else {
          delete newErrors.sdt;
        }
        break;
      case 'email':
        if (!emailRegex.test(value)) {
          newErrors.email = "Email không đúng định dạng";
        } else {
          delete newErrors.email;
        }
        break;

      default:
        break;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {

      const requestData = {
        hoTen: formData.hoTen,
        email: formData.email,
        sdt: formData.sdt,
        issueDescription: formData.message,
      };

      await postSupportRequest(requestData);
      setFormData({
        hoTen: "",
        email: "",
        sdt: "",
        message: "",
      });
      // toast.success("Yêu cầu hỗ trợ đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu hỗ trợ:", error);
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu hỗ trợ.");
    }
  };

  return (
    <Grid container spacing={4} sx={{ padding: 3 }}>
      {/* Phần hiển thị thông tin liên hệ */}
      <Grid item xs={12} sm={4}>
        <Box
          sx={{
            padding: 3,
            backgroundColor: "#f9f9f9",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography level="h6" startDecorator={<PhoneIcon />} sx={{ marginBottom: 2, fontWeight: "bold" }}>
            Gọi cho chúng tôi
          </Typography>
          <Typography level="body2">Chúng tôi hoạt động 24/7, 7 ngày trong tuần.</Typography>
          <Typography level="body2" sx={{ fontWeight: "bold", marginTop: 1 }}>
            Điện thoại: +84 999 999
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography level="h6" startDecorator={<EmailIcon />} sx={{ marginBottom: 2, fontWeight: "bold" }}>
            Viết thư cho chúng tôi
          </Typography>
          <Typography level="body2">Điền vào form và chúng tôi sẽ liên hệ lại trong vòng 24 giờ.</Typography>
          <Typography level="body2" sx={{ fontWeight: "bold", marginTop: 1 }}>
            Email: supportmoestore@moe.vn
          </Typography>
        </Box>
      </Grid>

      {/* Form liên hệ */}
      <Grid item xs={12} sm={8}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            padding: 3,
            backgroundColor: "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography level="h6" sx={{ marginBottom: 3, fontWeight: "bold" }}>
            Liên hệ với chúng tôi
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl >
                <FormLabel>Tên của bạn</FormLabel>
                <Input
                  placeholder="Nhập tên của bạn"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleInputChange}
                  sx={{
                    border: `1px solid ${errors.hoTen ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                    '&:hover:not(.Mui-disabled):before': {
                      borderColor: errors.hoTen ? 'red' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused': {
                      borderColor: errors.hoTen ? 'red' : 'primary.main',
                    },
                  }}
                />
                {errors.hoTen && (
                  <Typography color="error" variant="body2" sx={{  color: 'red' }}>
                    {errors.hoTen}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl >
                <FormLabel>Email của bạn</FormLabel>
                <Input
                  placeholder="Nhập email của bạn"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    border: `1px solid ${errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                    '&:hover:not(.Mui-disabled):before': {
                      borderColor: errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused': {
                      borderColor: errors.email ? 'red' : 'primary.main',
                    },
                  }}
                />
                {errors.email && (
                  <Typography color="error" variant="body2" sx={{  color: 'red' }}>
                    {errors.email}
                  </Typography>
                )}

              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl >
                <FormLabel>Số điện thoại của bạn</FormLabel>
                <Input
                  placeholder="Nhập số điện thoại của bạn"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                  sx={{
                    border: `1px solid ${errors.sdt ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                    '&:hover:not(.Mui-disabled):before': {
                      borderColor: errors.sdt ? 'red' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused': {
                      borderColor: errors.sdt ? 'red' : 'primary.main',
                    },
                  }}
                />
                {errors.sdt && (
                  <Typography color="error" variant="body2" sx={{  color: 'red' }}>
                    {errors.sdt}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Lời nhắn của bạn</FormLabel>
                <Textarea
                  placeholder="Nhập lời nhắn"
                  minRows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  sx={{
                    border: `1px solid ${errors.message ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                    '&:hover:not(.Mui-disabled):before': {
                      borderColor: errors.message ? 'red' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused': {
                      borderColor: errors.message ? 'red' : 'primary.main',
                    },
                  }}
                />
                {errors.message && (
                  <Typography color="error" variant="body2" sx={{  color: 'red' }}>
                    {errors.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" color="primary" variant="solid" fullWidth>
                Gửi lời nhắn
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
