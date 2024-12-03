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
    const tempErrors = {};
    const phoneRegex = /^0\d{9,11}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.hoTen.trim()) tempErrors.hoTen = "Họ tên là bắt buộc.";
    if (!formData.email.trim()) tempErrors.email = "Email là bắt buộc.";
    else if (!emailRegex.test(formData.email))
      tempErrors.email = "Email không đúng định dạng.";
    if (!formData.sdt.trim()) tempErrors.sdt = "Số điện thoại là bắt buộc.";
    else if (!phoneRegex.test(formData.sdt))
      tempErrors.sdt =
        "Số điện thoại phải bắt đầu bằng 0 và có từ 10-12 chữ số.";
    if (!formData.message.trim())
      tempErrors.message = "Lời nhắn là bắt buộc.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
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
          <Typography
            level="h6"
            startDecorator={<PhoneIcon />}
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            Gọi cho chúng tôi
          </Typography>
          <Typography level="body2">
            Chúng tôi hoạt động 24/7, 7 ngày trong tuần.
          </Typography>
          <Typography
            level="body2"
            sx={{ fontWeight: "bold", marginTop: 1 }}
          >
            Điện thoại: +84 999 999
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            level="h6"
            startDecorator={<EmailIcon />}
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            Viết thư cho chúng tôi
          </Typography>
          <Typography level="body2">
            Điền vào form và chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
          </Typography>
          <Typography
            level="body2"
            sx={{ fontWeight: "bold", marginTop: 1 }}
          >
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
            {[
              { label: "Tên của bạn", name: "hoTen" },
              { label: "Email của bạn", name: "email" },
              { label: "Số điện thoại của bạn", name: "sdt" },
            ].map((field, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <FormControl>
                  <FormLabel>{field.label}</FormLabel>
                  <Input
                    placeholder={`Nhập ${field.label.toLowerCase()}`}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    sx={{
                      border: `1px solid ${
                        errors[field.name] ? "red" : "rgba(0, 0, 0, 0.23)"
                      }`,
                    }}
                  />
                  {errors[field.name] && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ color: "red" }}
                    >
                      {errors[field.name]}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Lời nhắn</FormLabel>
                <Textarea
                  minRows={4}
                  placeholder="Nhập lời nhắn của bạn"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  sx={{
                    border: `1px solid ${
                      errors.message ? "red" : "rgba(0, 0, 0, 0.23)"
                    }`,
                  }}
                />
                {errors.message && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ color: "red" }}
                  >
                    {errors.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Box textAlign="right" marginTop={3}>
            <Button type="submit">Gửi yêu cầu</Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
