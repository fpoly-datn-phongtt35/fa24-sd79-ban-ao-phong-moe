import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, Button, Container, Grid, Link, Sheet, Table, Typography } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchAllDiscounts, deleteDiscount, searchDiscounts } from "~/apis/discountApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Pagination, IconButton, TextField } from "@mui/material";

export const Promotion = () => {
  const [discounts, setDiscounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    handleSetDiscounts();
  }, []);

  // Giám sát thay đổi của điều kiện tìm kiếm
  useEffect(() => {
    setCurrentPage(1); // Reset trang khi điều kiện tìm kiếm thay đổi
    handleSearch(1);   // Tìm kiếm dữ liệu với trang đầu tiên
  }, [searchTerm, searchStartDate, searchEndDate]);

  const handleSetDiscounts = async (page = currentPage) => {
    try {
      const res = await fetchAllDiscounts(page - 1, itemsPerPage);
      setDiscounts(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch discounts", error);
      setDiscounts([]);
    }
  };

  const handleSearch = async (page = 1) => {
    try {
      const results = await searchDiscounts(searchTerm, searchStartDate, searchEndDate, page - 1, itemsPerPage);
      setDiscounts(results.data.content || []);
      setTotalPages(results.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to search discounts", error);
      setDiscounts([]);
    }
  };

  const onDelete = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Bạn có chắc không?",
        text: "Sau khi xóa, không thể khôi phục đợt giảm giá này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có, xóa nó!",
        cancelButtonText: "Hủy",
      });

      if (confirmResult.isConfirmed) {
        await deleteDiscount(id);
        Swal.fire("Đã xóa!", "Đợt giảm giá đã được xóa.", "success");
        handleSetDiscounts(currentPage); // Cập nhật lại danh sách
      }
    } catch (error) {
      console.error("Failed to delete discount", error);
      Swal.fire("Lỗi", "Không thể xóa đợt giảm giá", "error");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSearchStartDate("");
    setSearchEndDate("");
    setCurrentPage(1);
    handleSetDiscounts(); // Lấy lại danh sách ban đầu
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    if (searchTerm || searchStartDate || searchEndDate) {
      handleSearch(newPage); // Gọi tìm kiếm nếu có điều kiện
    } else {
      handleSetDiscounts(newPage); // Lấy lại dữ liệu theo trang nếu không tìm kiếm
    }
  };

  return (
    <Container maxWidth="max-width" sx={{ height: "100%", marginTop: "15px", backgroundColor: "#fff" }}>
      <Grid container spacing={2} alignItems="center" marginBottom={2} height={"50px"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Typography sx={{ color: "text.white", cursor: "pointer" }}>Quản lý đợt giảm giá</Typography>
        </Breadcrumbs>
      </Grid>

      <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography level="title-lg">Quản lý đợt giảm giá</Typography>
      </Box>

      <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            label="Tìm kiếm tên"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={searchStartDate}
            onChange={(e) => setSearchStartDate(e.target.value)}
            size="small"
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={searchEndDate}
            onChange={(e) => setSearchEndDate(e.target.value)}
            size="small"
          />
        </Box>

        <Box>
          <Button variant="soft" size="small" startDecorator={<RefreshIcon />} onClick={handleResetFilters} sx={{ marginRight: 1 }}>Làm mới</Button>
          <Button size="small" startDecorator={<AddIcon />} onClick={() => navigate("/promotions/add")}>Thêm mới</Button>
        </Box>
      </Box>

      <Sheet>
        <Table aria-label="discounts table" borderAxis="x" variant="outlined">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Mã</th>
              <th>Tỷ lệ giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length > 0 ? (
              discounts.map((discount, index) => (
                <tr key={discount.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{discount.name}</td>
                  <td>{discount.code}</td>
                  <td>{discount.percent}%</td>
                  <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                  <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                  <td>{discount.note}</td>
                  <td>
                    <IconButton color='warning' onClick={() => navigate(`/promotions/update/${discount.id}`)}><EditIcon /></IconButton>
                    <IconButton color='error' onClick={() => onDelete(discount.id)}><HighlightOffIcon /></IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Không có đợt giảm giá nào.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};
