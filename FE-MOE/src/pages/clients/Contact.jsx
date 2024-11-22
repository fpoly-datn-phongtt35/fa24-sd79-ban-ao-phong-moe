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
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
      if (!userId) {
        toast.error("Vui lòng đăng nhập để gửi yêu cầu hỗ trợ.");
        return;
      }

      const requestData = {
        customerId: userId, // Dùng userId thay vì hardcode giá trị
        issueDescription: formData.message,
      };

      await postSupportRequest(requestData);
      setFormData({
        name: "",
        email: "",
        phone: "",
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
              <FormControl required>
                <FormLabel>Tên của bạn</FormLabel>
                <Input
                  placeholder="Nhập tên của bạn"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  sx={{
                    borderColor: "#d0d0d0",
                    "&:hover": { borderColor: "#b0b0b0" },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl required>
                <FormLabel>Email của bạn</FormLabel>
                <Input
                  placeholder="Nhập email của bạn"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{
                    borderColor: "#d0d0d0",
                    "&:hover": { borderColor: "#b0b0b0" },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl required>
                <FormLabel>Số điện thoại của bạn</FormLabel>
                <Input
                  placeholder="Nhập số điện thoại của bạn"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  sx={{
                    borderColor: "#d0d0d0",
                    "&:hover": { borderColor: "#b0b0b0" },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <FormLabel>Lời nhắn của bạn</FormLabel>
                <Textarea
                  placeholder="Nhập lời nhắn"
                  minRows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  sx={{
                    borderColor: "#d0d0d0",
                    "&:hover": { borderColor: "#b0b0b0" },
                  }}
                />
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
