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
import { Pagination, IconButton, TextField, TableRow, TableCell } from "@mui/material";
import { remove as removeDiacritics } from "diacritics";

export const Promotion = () => {
  const [discounts, setDiscounts] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    size: 5,
    searchTerm: "",
    searchStartDate: "",
    searchEndDate: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const normalizedSearchTerm = removeDiacritics(filters.searchTerm);
      const response = filters.searchTerm || filters.searchStartDate || filters.searchEndDate
        ? await searchDiscounts(normalizedSearchTerm, filters.searchStartDate, filters.searchEndDate, filters.page - 1, filters.size)
        : await fetchAllDiscounts(filters.page - 1, filters.size, "id", "desc");

      setDiscounts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Không thể lấy đợt giảm giá", error);
      setDiscounts([]);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1, // Đặt lại về trang đầu tiên nếu thay đổi bộ lọc tìm kiếm
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      size: 5,
      searchTerm: "",
      searchStartDate: "",
      searchEndDate: "",
    });
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
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete discount", error);
      Swal.fire("Lỗi", "Không thể xóa đợt giảm giá", "error");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} | ${hours}:${minutes}`;
  };

  const getDiscountStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) {
      return "Chưa bắt đầu";
    } else if (currentDate > end) {
      return "Kết thúc";
    } else {
      return "Đang hoạt động";
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
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            size="small"
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.searchStartDate}
            onChange={(e) => handleFilterChange("searchStartDate", e.target.value)}
            size="small"
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.searchEndDate}
            onChange={(e) => handleFilterChange("searchEndDate", e.target.value)}
            size="small"
          />
        </Box>

        <Box>
          <Button variant="soft" size="small" startDecorator={<RefreshIcon />} onClick={handleResetFilters} sx={{ marginRight: 1 }}>Làm mới</Button>
          <Button
            size="small"
            startDecorator={<AddIcon />}
            onClick={() => {
              navigate("/promotions/add");
              fetchData();
            }}
          >
            Thêm mới
          </Button>
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
              <th>Trạng thái</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length > 0 ? (
              discounts.map((discount, index) => (
                <TableRow key={discount.id}>
                  <TableCell>{(filters.page - 1) * filters.size + index + 1}</TableCell>
                  <TableCell>{discount.name}</TableCell>
                  <TableCell>{discount.code}</TableCell>
                  <TableCell>{discount.percent}%</TableCell>
                  <TableCell align="left">{formatDate(discount.startDate)}</TableCell>
                  <TableCell align="left">{formatDate(discount.endDate)}</TableCell>
                  <TableCell>{getDiscountStatus(discount.startDate, discount.endDate)}</TableCell>
                  <TableCell>{discount.note}</TableCell>
                  <TableCell>
                    <IconButton color="warning" onClick={() => navigate(`/promotions/update/${discount.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(discount.id)}>
                      <HighlightOffIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan="9">Không có đợt giảm giá nào.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      <Pagination
        count={totalPages}
        page={filters.page}
        onChange={(event, page) => handleFilterChange("page", page)}
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};
