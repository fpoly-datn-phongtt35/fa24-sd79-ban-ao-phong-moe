import { useEffect, useState } from "react";
import { Row, Col, Pagination, Form } from "react-bootstrap";
import { fetchAllDiscounts, deleteDiscount } from "~/apis/discountApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Box, Breadcrumbs, Button, Container, Grid, Link, Sheet, Table, Typography } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from "@mui/icons-material/Home";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RefreshIcon from "@mui/icons-material/Refresh";


export const Promotion = () => {
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    handleSetDiscounts();
  }, []);

  const handleSetDiscounts = async () => {
    const res = await fetchAllDiscounts();
    setDiscounts(res.data);
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
        handleSetDiscounts();
      }
    } catch (error) {
      console.error("Failed to delete discount", error);
      Swal.fire("Lỗi", "Không thể xóa đợt giảm giá", "error");
    }
  };

  // Hàm để reset bộ lọc
  const handleResetFilters = () => {
    setSearchTerm("");
    setSearchStartDate("");
    setSearchEndDate("");
    handleSetDiscounts(); // Nạp lại danh sách giảm giá
    setCurrentPage(1); // Đặt lại trang hiện tại về 1
  };

  // Lọc danh sách đợt giảm giá
  const filteredDiscounts = discounts.filter((discount) => {
    const discountStartDate = new Date(discount.startDate).setHours(0, 0, 0, 0);
    const discountEndDate = new Date(discount.endDate).setHours(0, 0, 0, 0);

    const isNameMatched = discount.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isWithinDateRange =
      (!searchStartDate || new Date(searchStartDate).setHours(0, 0, 0, 0) <= discountEndDate) &&
      (!searchEndDate || new Date(searchEndDate).setHours(0, 0, 0, 0) >= discountStartDate);

    return isNameMatched && isWithinDateRange;
  });

  // Tính toán số lượng trang
  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  // Lấy dữ liệu cho trang hiện tại
  const currentDiscounts = filteredDiscounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container maxWidth="max-width"
      sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}>

      <Grid
        container
        spacing={2}
        alignItems="center"
        marginBottom={2}
        height={"50px"}
      >
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
          <Typography sx={{ color: "text.white", cursor: "pointer" }}>
            Quản lý đợt giảm giá
          </Typography>
        </Breadcrumbs>
      </Grid>

      <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography level="title-lg">
          Quản lý đợt giảm giá
        </Typography>
        <Box>
          <Button
            variant="soft"
            size="sm"
            startDecorator={<RefreshIcon />}
            onClick={handleResetFilters}
            sx={{ marginRight: 1 }}
          >
            Làm mới
          </Button>
          <Button size="sm" startDecorator={<AddIcon />} onClick={() => navigate("/promotions/add")}>
            Thêm mới
          </Button>
        </Box>
      </Box>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Nhập tên đợt giảm giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={searchStartDate}
            onChange={(e) => setSearchStartDate(e.target.value)}
            placeholder="Ngày bắt đầu..."
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={searchEndDate}
            onChange={(e) => setSearchEndDate(e.target.value)}
            placeholder="Ngày kết thúc..."
          />
        </Col>
      </Row>

      {/* <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startDecorator={<RefreshIcon />}
          onClick={handleResetFilters}
          variant="outlined"
        >
          Reset
        </Button>
      </Box> */}

      <Sheet>
        <Table borderAxis="x" variant="outlined">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Mã</th>
              <th>Tỷ lệ giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Sản phẩm</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentDiscounts.length > 0 ? (
              currentDiscounts.map((discount, index) => (
                <tr key={discount.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{discount.name}</td>
                  <td>{discount.code}</td>
                  <td>{discount.percent}%</td>
                  <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                  <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                  <td>{discount.numberOfProduct}</td>
                  <td>{discount.note}</td>
                  <td>

                    <IconButton color='warning' onClick={() => navigate(`/promotions/update/${discount.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color='error' onClick={() => onDelete(discount.id)}>
                      <HighlightOffIcon />
                    </IconButton>
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

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>

    </Container>
  );
};
