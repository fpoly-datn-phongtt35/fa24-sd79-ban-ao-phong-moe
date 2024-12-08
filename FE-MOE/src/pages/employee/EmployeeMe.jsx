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
  const [isUpdating, setIsUpdating] = useState(false);  // Trạng thái khi đang cập nhật
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    last_name: '',
    first_name: '',
    email: '',
    phone_number: '',
    salary: '',
    position: '',
    gender: '',
    date_of_birth: '',
    city: '',
    district: '',
    ward: '',
    streetName: '',
});
  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };

  const formatDate2 = (dateTimeString) => {
    const [datePart] = dateTimeString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${year}-${month}-${day}`;
  };

  // Lấy thông tin nhân viên khi component được mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID không hợp lệ");
      return;
    }

    setIsLoading(true);
    getEmployeeDetail(userId)
      .then((response) => {
        console.log("Dữ liệu nhận được từ API:", response);
        if (!response || !response.data) {
          console.error("Dữ liệu API không hợp lệ");
          return;
        }

        const data = response.data;
        setEmployeeData({
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
          phone_number: employeeData.phone_number,
          gender: employeeData.gender === "Nam" ? "MALE" : employeeData.gender === "Nữ" ? "FEMALE" : "OTHER",
          date_of_birth: formatDate2(employeeData.date_of_birth),
          salary: employeeData.salaries,
          position: employeeData.position.id,
          avatar: employeeData.avatar,
          email: employeeData.email,
          city: employeeData.employee_address.city,
          district: employeeData.employee_address.district,
          ward: employeeData.employee_address.ward,
          streetName: employeeData.employee_address.streetName,
      });
        

      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin nhân viên:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);


  // Xử lý thay đổi thông tin nhân viên
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý cập nhật thông tin nhân viên
  const handleUpdate = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID không hợp lệ");
      return;
    }

    setIsUpdating(true);
    updateEmployeeDetail(userId, employeeData)
      .then((response) => {
        console.log("Cập nhật thành công:", response);
        // Thêm thông báo cho người dùng khi cập nhật thành công, ví dụ:
        alert("Cập nhật thông tin thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật thông tin nhân viên:", error);
        // Thêm thông báo cho người dùng khi có lỗi
        alert("Đã có lỗi xảy ra khi cập nhật thông tin!");
      })
      .finally(() => {
        setIsUpdating(false);
      });
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
                        <Button disabled={isUpdating} onClick={handleUpdate}>
                          {isUpdating ? "Đang cập nhật..." : "Cập Nhật Người Dùng"}
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
