import React, { useContext, useEffect, useState } from "react";
import { getAllSupport, updateStatus, deleteSupportById } from "~/apis/supportApi";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Select,
  MenuItem,
  FormControl,
  Button,
  Container,
  Grid,
  Breadcrumbs,
  Link,
} from '@mui/material';
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from 'react-router-dom';
import { CommonContext } from "~/context/CommonContext";

const Support = () => {
  const [supports, setSupports] = useState([]);
  const context = useContext(CommonContext);
  const navigate = useNavigate();

  // Hàm để cập nhật trạng thái
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateStatus(newStatus, id);
      setSupports((prevSupports) =>
        prevSupports.map((support) =>
          support.id === id ? { ...support, status: newStatus } : support
        )
      );
      context.fetchSupportRequests();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  // Hàm để xóa thông báo
  const handleDeleteSupport = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      try {
        await deleteSupportById(id);
        setSupports((prevSupports) => prevSupports.filter((support) => support.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa thông báo:", error);
      }
    }
  };

  // Lấy dữ liệu hỗ trợ khi component mount
  useEffect(() => {
    const fetchSupports = async () => {
      try {
        const response = await getAllSupport();
        const data = response.data;
        if (Array.isArray(data)) {
          const validData = data.filter((item) => item.hoTen && item.email && item.sdt && item.issueDescription);
          setSupports(validData);
        } else {
          console.error("Dữ liệu trả về không phải mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchSupports();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        marginTop: "20px",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Grid container spacing={2} alignItems="center" marginBottom={2}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "10px" }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Typography sx={{ color: "text.secondary", cursor: "pointer" }}>
            Quản lý thông báo
          </Typography>
        </Breadcrumbs>
      </Grid>

      <Box
        sx={{
          maxWidth: "100%",
          mx: "auto",
          mt: 3,
          p: 3,
          borderColor: "divider",
          borderRadius: 4,
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            textAlign: "center",
            marginBottom: 3,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Danh sách thông báo
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 500,
            overflow: "auto",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Họ Tên
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Số Điện Thoại
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Mô Tả
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Trạng Thái
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Hành Động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(supports) &&
                supports.map((support) => (
                  <TableRow key={support.id}>
                    <TableCell align="center">{support.hoTen || "(Chưa có dữ liệu)"}</TableCell>
                    <TableCell align="center">{support.email || "(Chưa có dữ liệu)"}</TableCell>
                    <TableCell align="center">{support.sdt || "(Chưa có dữ liệu)"}</TableCell>
                    <TableCell align="center">{support.issueDescription || "(Chưa có dữ liệu)"}</TableCell>
                    <TableCell align="center">
                      <FormControl sx={{ minWidth: "150px", margin: "0 auto" }} size="small">
                        <Select
                          value={support.status || 0}
                          onChange={(e) =>
                            handleUpdateStatus(support.id, Number(e.target.value))
                          }
                        >
                          <MenuItem value={0}>Chưa xử lý</MenuItem>
                          <MenuItem value={1}>Đã xử lý</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteSupport(support.id)}
                      >
                        
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Support;
