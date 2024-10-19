import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { detailDiscount, putDiscount } from "~/apis/discountApi";
import Swal from "sweetalert2";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { useEffect } from "react";

export const UpdatePromotion = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };

 //Hàm lấy thông tin chi tiết để cập nhật
  useEffect(() => {
    const fetchPromotionDetail = async () => {
      try {
        const response = await detailDiscount(id);
        if (response && response.status === 200) {
          const promotionData = response.data;
          //Đặt giá trị biểu mẫu với dữ liệu đã lấy
          setValue("name", promotionData.name);
          setValue("promotionValue", promotionData.promotionValue);
          setValue("startDate", promotionData.startDate.split(' ')[0]); 
          setValue("endDate", promotionData.endDate.split(' ')[0]);
          setValue("description", promotionData.description);
        } else {
          Swal.fire("Lỗi", "Không thể tải thông tin đợt giảm giá", "error");
        }
      } catch (error) {
        console.error("Error fetching promotion details:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi tải thông tin đợt giảm giá", "error");
      }
    };

    fetchPromotionDetail();
  }, [id, setValue]);

  
  const onSubmit = async (data) => {
    try {
      const response = await putDiscount(id, {
        name: data.name,
        promotionValue: parseInt(data.promotionValue), //Đảm bảo giá trị là 1 số nguyên
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        description: data.description,
        userId: localStorage.getItem("userId"), // Đảm bảo lấy đúng userId từ localStorage
      });

      if (response && response.status === 200) {
        Swal.fire("Thành công", "Đợt giảm giá đã được cập nhật!", "success");
        navigate("/promotions"); // Redirect to promotions list after successful update
      } else {
        Swal.fire("Lỗi", "Không thể cập nhật đợt giảm giá", "error");
      }
    } catch (error) {
      console.error("Error updating discount:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật đợt giảm giá", "error");
    }
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm" style={{ marginTop: "15px" }}>
      <h2 className="mb-4">Cập nhật đợt giảm giá</h2>
      
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
          Cập nhật
        </Button>
        <Button variant="secondary" onClick={() => navigate("/promotions")} className="ms-2">
          Hủy
        </Button>
      </Form>
    </Container>
  );
};
