import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Table, Pagination, Form } from "react-bootstrap";
import { fetchAllDiscounts, deleteDiscount } from "~/apis/discountApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    <Container className="bg-white p-4 rounded shadow-sm" style={{ marginTop: "15px" }}>
      <div className="fs-3 mb-4">
        <span className="fw-bold">Quản lý đợt giảm giá</span>
        <Button className="float-end" onClick={() => navigate("/promotions/add")}>
          Thêm mới
        </Button>
      </div>

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

      <div className="table-responsive">
        <Table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Tỷ lệ giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
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
                  <td>{discount.promotionValue}%</td>
                  <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                  <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                  <td>{discount.description}</td>
                  <td>
                    <Button
                      variant="warning" 
                      className="me-2"
                      onClick={() => navigate(`/promotions/update/${discount.id}`)}
                    >
                      <i className="fa-solid fa-square-pen"></i>
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(discount.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </Button>
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
      </div>

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
