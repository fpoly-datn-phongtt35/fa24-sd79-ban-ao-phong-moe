import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Table, Form, Pagination } from "react-bootstrap";
import { fetchAllDiscounts, postDiscount, deleteDiscount, putDiscount } from "~/apis/discountApi";
import { useForm } from "react-hook-form";
import { useNavigate  } from "react-router-dom";
import Swal from "sweetalert2";

export const Promotion = () => {
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State quản lý trang hiện tại
  const itemsPerPage = 5; // Số lượng mục hiển thị mỗi trang

  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };
  

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    handleSetDiscounts();
  }, []);

  const handleSetDiscounts = async () => {
    const res = await fetchAllDiscounts();
    setDiscounts(res.data);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedDiscount) {
        await putDiscount({
          name: data.name,
          promotionValue: data.promotionValue,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          description: data.description,
        }, selectedDiscount.id);
        Swal.fire("Thành công", "Đợt giảm giá đã được cập nhật!", "success");
      } else {
        await postDiscount({
          name: data.name,
          promotionValue: data.promotionValue,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          description: data.description,
          userId: localStorage.getItem("userId"),
        });
        Swal.fire("Thành công", "Đợt giảm giá đã được thêm!", "success");
      }

      handleSetDiscounts();
      reset();
      setSelectedDiscount(null);
    } catch (error) {
      console.error("Failed to add/update discount", error);
      Swal.fire("Lỗi", "Không thể thêm hoặc cập nhật đợt giảm giá", "error");
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
        handleSetDiscounts();
      }
    } catch (error) {
      console.error("Failed to delete discount", error);
      Swal.fire("Lỗi", "Không thể xóa đợt giảm giá", "error");
    }
  };

  const onEdit = (discount) => {
    setSelectedDiscount(discount);
    setValue("name", discount.name);
    setValue("promotionType", discount.promotionType);
    setValue("promotionValue", discount.promotionValue);
    setValue("startDate", discount.startDate.split(" ")[0]);
    setValue("endDate", discount.endDate.split(" ")[0]);
    setValue("description", discount.description);
  };

  // Lọc danh sách đợt giảm giá dựa trên tên và khoảng thời gian
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

  const handleReset = () => {
    setSearchTerm("");
    setSearchStartDate("");
    setSearchEndDate("");
    setSelectedDiscount(null);
    reset();
    handleSetDiscounts();
    setCurrentPage(1); // Đặt lại trang về 1 sau khi reset
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm" style={{ marginTop: "15px" }}>
      <div className="fs-3 mb-4">
        <span className="fw-bold">
          {selectedDiscount ? "Chỉnh sửa đợt giảm giá" : "Quản lý đợt giảm giá"}
        </span>
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
      
      <Row className="mb-5">
        <Col>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-2">
              {/* Form input fields */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đợt giảm giá</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Nhập tên đợt giảm giá"
                    isInvalid={errors.name}
                  />
                  {errors.name && (
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên đợt giảm giá.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tỷ lệ giảm giá (%)</Form.Label>
                  <Form.Control
                    type="number"
                    {...register("promotionValue", { required: true, min: 1, max: 100 })}
                    placeholder="Nhập tỷ lệ giảm giá"
                    isInvalid={errors.promotionValue}
                  />
                  {errors.promotionValue && (
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tỷ lệ giảm giá từ 1 đến 100.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("startDate", { required: true })}
                    isInvalid={errors.startDate}
                  />
                  {errors.startDate && (
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn ngày bắt đầu.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("endDate", { required: true })}
                    isInvalid={errors.endDate}
                  />
                  {errors.endDate && (
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn ngày kết thúc.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("description", { required: true })}
                    placeholder="Nhập mô tả"
                    isInvalid={errors.description}
                  />
                  {errors.description && (
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập mô tả.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Button type="submit" className="me-2">
                  {selectedDiscount ? "Cập nhật" : "Thêm mới"}
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </form>
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
                    <Button variant="warning" className="me-2" onClick={() => onEdit(discount)}>
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

      {/* Pagination Component */}
      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
};
