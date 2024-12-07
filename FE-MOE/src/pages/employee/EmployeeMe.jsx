import React, { useState, useEffect } from "react";
import {
  Container,
  Sheet,
  Typography,
  Input,
  Button,
  Grid,
  FormControl,
  FormLabel,
  Breadcrumbs,
  Link,
  Box,
  RadioGroup,
  Radio,
  Avatar,
} from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import { getEmployeeDetail, updateEmployeeDetail } from "~/apis/employeeApi";
import { useNavigate } from 'react-router-dom';

export const EmployeeMe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    gender: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID:", userId); // Ensure the user ID is valid
    if (!userId) {
      console.error("User ID không hợp lệ:", userId);
      return;
    }

    setIsLoading(true);
    getEmployeeDetail(userId)
      .then((response) => {
        if (!response || !response.data) {
          console.error("Dữ liệu API không hợp lệ:", response);
          return;
        }

        const data = response.data; // Assuming response.data contains the employee info
        console.log("Dữ liệu API:", data);

        // Ensure the data contains the expected fields
        if (
          !data.first_name ||
          !data.last_name ||
          !data.full_name ||
          !data.phone_number ||
          !data.email ||
          !data.gender
        ) {
          console.error("Một số trường dữ liệu không hợp lệ:", data);
          return;
        }

        const gender = data.gender === "Nam" ? "MALE" : data.gender === "Nữ" ? "FEMALE" : "OTHER";

        setEmployeeData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          gender: gender, // Ensure gender is correctly mapped to 'MALE', 'FEMALE', or 'OTHER'
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin nhân viên:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };



  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Grid sx={{ mb: 2 }}>
        <Sheet variant="outlined" sx={{ display: "flex", flexDirection: "column", borderRadius: "md" }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
            <Link
              disabled={isLoading}
              underline="hover"
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              color="inherit"
              onClick={() => navigate("/")}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Trang chủ
            </Link>
            <Link
              disabled={isLoading}
              underline="hover"
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              color="inherit"
              onClick={() => navigate("/employeeMe")}
            >
              Thông tin tài khoản
            </Link>
          </Breadcrumbs>
        </Sheet>
      </Grid>

      <Grid container spacing={2}>
        <Grid xs={12} md={9}>
          <Box p={0}>
            <Box component="form" noValidate autoComplete="off">
              <Sheet variant="outlined" sx={{ p: 3, borderRadius: "md" }}>
                <Typography level="h5" fontWeight="lg" gutterBottom>
                  THÔNG TIN TÀI KHOẢN
                </Typography>

                <Grid container spacing={2}>
                  <Grid xs={12} sm={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 5 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Button>Chọn Ảnh</Button>
                    </Box>
                  </Grid>

                  <Grid xs={12} sm={8}>
                    <Grid spacing={2}>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Họ</FormLabel>
                          <Input
                            name="last_name"
                            value={employeeData.last_name}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Tên</FormLabel>
                          <Input
                            name="first_name"
                            value={employeeData.first_name}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Điện thoại</FormLabel>
                          <Input
                            name="phone_number"
                            value={employeeData.phone_number}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Email</FormLabel>
                          <Input
                            name="email"
                            value={employeeData.email}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Grid>

                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Giới tính</FormLabel>
                          <RadioGroup value={employeeData.gender} onChange={handleInputChange} name="gender">
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <Radio label="Nam" value="MALE" />
                              <Radio label="Nữ" value="FEMALE" />
                              <Radio label="Khác" value="OTHER" />
                            </Box>
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      <Grid xs={6} sx={{ marginTop: 1 }}>
                        <Button disabled={isLoading}>
                          {isLoading ? "Đang cập nhật..." : "Cập Nhật Người Dùng"}
                        </Button>
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
  );
};

export default EmployeeMe;
