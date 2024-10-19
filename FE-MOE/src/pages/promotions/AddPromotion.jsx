import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postDiscount } from "~/apis/discountApi"; // Kiểm tra đường dẫn API đúng không
import Swal from "sweetalert2";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

export const AddPromotion = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Hàm formatDate để định dạng ngày tháng (tùy theo yêu cầu của bạn)
  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };
  
  const onSubmit = async (data) => {
    try {
      // Gọi API postDiscount để thêm đợt giảm giá
      const response = await postDiscount({
        name: data.name,
        promotionValue: parseInt(data.promotionValue), // Đảm bảo tỷ lệ giảm giá là số nguyên
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        description: data.description,
        userId: localStorage.getItem("userId"), // Đảm bảo lấy đúng userId từ localStorage
      });

      if (response && response.status === 200) {  // Kiểm tra nếu phản hồi thành công   
        Swal.fire("Thành công", "Đợt giảm giá đã được thêm!", "success");
        navigate("/promotions");  // Quay lại trang danh sách sau khi thêm thành công
      } else {
        Swal.fire("Lỗi", "Không thể thêm đợt giảm giá", "error");
      }
    } catch (error) {
      console.error("Error adding discount:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi thêm đợt giảm giá", "error");
    }
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm" style={{ marginTop: "15px" }}>
      {/* Thêm tiêu đề */}
      <h2 className="mb-4">Tạo đợt giảm giá</h2>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tên đợt giảm giá</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đợt giảm giá"
                {...register("name", { required: true })}
              />
              {errors.name && <span className="text-danger">Tên đợt giảm giá là bắt buộc</span>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tỷ lệ giảm (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập tỷ lệ giảm"
                {...register("promotionValue", { required: true, min: 1, max: 100 })}
              />
              {errors.promotionValue && (
                <span className="text-danger">
                  Tỷ lệ giảm là bắt buộc và phải từ 1% đến 100%
                </span>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control
                type="date"
                {...register("startDate", { required: true })}
              />
              {errors.startDate && <span className="text-danger">Ngày bắt đầu là bắt buộc</span>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ngày kết thúc</Form.Label>
              <Form.Control
                type="date"
                {...register("endDate", { required: true })}
              />
              {errors.endDate && <span className="text-danger">Ngày kết thúc là bắt buộc</span>}
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register("description")}
            placeholder="Nhập mô tả"
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Thêm mới
        </Button>
        <Button variant="secondary" onClick={() => navigate("/promotions")} className="ms-2">
          Hủy
        </Button>
      </Form>
    </Container>
  );
};
