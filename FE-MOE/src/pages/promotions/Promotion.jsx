// src/components/Promotion.js
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { fetchAllDiscounts, postDiscount, deleteDiscount, putDiscount } from "~/apis/discountApi"; // Điều chỉnh đường dẫn nếu cần
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const Promotion = () => {
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Để lưu đợt giảm giá đang chỉnh sửa

  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
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

  // Hàm lấy tất cả đợt giảm giá từ API
  const handleSetDiscounts = async () => {
      const res = await fetchAllDiscounts();
      setDiscounts(res.data);
      console.log("Fetched discounts:", res.data);
  };

  // Hàm xử lý khi submit form: thêm hoặc cập nhật
  const onSubmit = async (data) => {
    try {
      if (selectedDiscount) {
        // Nếu đang chỉnh sửa, gọi API cập nhật
        await putDiscount({
          name: data.name,
          promotionType: data.promotionType,
          promotionValue: data.promotionValue,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          description: data.description,
          // Nếu cần, thêm userId hoặc các trường khác
        }, selectedDiscount.id);

        Swal.fire("Thành công", "Đợt giảm giá đã được cập nhật!", "success");
      } else {
        // Nếu đang thêm mới, gọi API thêm mới
        await postDiscount({
          name: data.name,
          promotionType: data.promotionType,
          promotionValue: data.promotionValue,
          startDate: formatDate(data.startDate),       
          endDate: formatDate(data.endDate),
          // endDate: new Date(data.endDate).toISOString(),
          description: data.description,
          userId: localStorage.getItem("userId"),
        });
        handleSetDiscounts();
        Swal.fire("Thành công", "Đợt giảm giá đã được thêm!", "success");
      }

       // Làm mới danh sách
       handleSetDiscounts();
      reset(); // Reset form
      setSelectedDiscount(null); // Reset đợt giảm giá đang chỉnh sửa
    } catch (error) {
      console.error("Failed to add/update discount", error);
      Swal.fire("Lỗi", "Không thể thêm hoặc cập nhật đợt giảm giá", "error");
    }
  };

  // Hàm xóa đợt giảm giá
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
        handleSetDiscounts(); // Làm mới danh sách
      }
    } catch (error) {
      console.error("Failed to delete discount", error);
      Swal.fire("Lỗi", "Không thể xóa đợt giảm giá", "error");
    }
  };

  // Hàm chỉnh sửa đợt giảm giá: set selectedDiscount và set giá trị form
  const onEdit = (discount) => {
    setSelectedDiscount(discount);
    setValue("name", discount.name);
    setValue("promotionType", discount.promotionType);
    setValue("promotionValue", discount.promotionValue);
    setValue('startDate', discount.startDate.split(' ')[0]);
    setValue('endDate', discount.endDate.split(' ')[0]);
    // setValue("endDate", "01-01-2024 | 00:00:00");
    setValue("description", discount.description);
  };

  return (
    <Container className="bg-white" style={{ height: "100%" }}>
      {/* Tiêu đề */}
      <div className="fs-5">
        <span className="fw-bold">
          {selectedDiscount ? "Chỉnh sửa đợt giảm giá" : "Quản lý đợt giảm giá"}
        </span>
      </div>
      <hr />

      {/* Form thêm hoặc chỉnh sửa đợt giảm giá */}
      <div className="mb-5 row">
        {/* Tìm kiếm */}
        <div className="col-6">
          <input
            type="search"
            className="form-control"
            placeholder="Nhập tên đợt giảm giá..."
          // Thêm chức năng tìm kiếm nếu cần
          />
        </div>

        {/* Form thêm/chỉnh sửa */}
        <div className="col text-end ">
          <form onSubmit={handleSubmit(onSubmit)} className="row">
            {/* Tên đợt giảm giá */}
            <div className="mb-2 col-md-6">
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Tên đợt giảm giá..."
                {...register("name", { required: "Vui lòng nhập tên đợt giảm giá" })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            {/* Loại giảm giá */}
            <div className="mb-2 col-md-6">
              <input
                type="text"
                className={`form-control ${errors.promotionType ? "is-invalid" : ""}`}
                placeholder="Loại giảm giá..."
                {...register("promotionType", { required: "Vui lòng nhập loại giảm giá" })}
              />
              {errors.promotionType && (
                <div className="invalid-feedback">{errors.promotionType.message}</div>
              )}
            </div>

            {/* Tỷ lệ giảm giá */}
            <div className="mb-2 col-md-6">
              <input
                type="number"
                className={`form-control ${errors.promotionValue ? "is-invalid" : ""}`}
                placeholder="Tỷ lệ giảm giá (%)..."
                {...register("promotionValue", { required: "Vui lòng nhập tỷ lệ giảm giá" })}
              />
              {errors.promotionValue && (
                <div className="invalid-feedback">{errors.promotionValue.message}</div>
              )}
            </div>

            {/* Ngày bắt đầu */}
            <div className="mb-2 col-md-6">
              <input
                type="date"
                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                placeholder="Ngày bắt đầu..."
                {...register("startDate", { required: "Vui lòng chọn ngày bắt đầu" })}
              />
              {errors.startDate && (
                <div className="invalid-feedback">{errors.startDate.message}</div>
              )}
            </div>

            {/* Ngày kết thúc */}
            <div className="mb-2 col-md-6">
              <input
                type="date"
                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                placeholder="Ngày kết thúc..."
                {...register("endDate", { required: "Vui lòng chọn ngày kết thúc" })}
              />
              {errors.endDate && (
                <div className="invalid-feedback">{errors.endDate.message}</div>
              )}
            </div>

            {/* Mô tả */}
            <div className="mb-2 col-md-6">
              <input
                type="text"
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                placeholder="Mô tả..."
                {...register("description", { required: "Vui lòng nhập mô tả" })}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description.message}</div>
              )}
            </div>

            {/* Nút submit */}
            <div className="mb-2 col-md-12 text-end">
              <button type="submit" className="btn btn-outline-secondary">
                {selectedDiscount ? "Cập nhật" : "Thêm đợt giảm giá"}{" "}
                <i className={`fa-solid ${selectedDiscount ? "fa-pen" : "fa-plus"}`}></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bảng danh sách đợt giảm giá */}
      <div>
        <table className="table">
          <thead>
            <tr className="text-center">
              <th scope="col">#</th>
              <th scope="col">Tên đợt giảm giá</th>
              <th scope="col">Loại giảm giá</th>
              <th scope="col">Tỷ lệ giảm giá</th>
              <th scope="col">Ngày bắt đầu</th>
              <th scope="col">Ngày kết thúc</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length > 0 ? (
              discounts.map((discount, index) => (
                <tr key={discount.id} className="text-center">
                  <th scope="row">{index + 1}</th>
                  <td>{discount.name}</td>
                  <td>{discount.promotionType}</td>
                  <td>{discount.promotionValue}%</td>
                  <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                  <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                  <td>{discount.description}</td>
                  <td className="text-center">
                    {/* Nút chỉnh sửa */}
                    <button
                      className="btn me-2"
                      onClick={() => onEdit(discount)}
                    >
                      <i className="fa-solid fa-square-pen text-warning"></i>
                    </button>
                    {/* Nút xóa */}
                    <button className="btn" onClick={() => onDelete(discount.id)}>
                      <i className="fa-solid fa-trash text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Không có đợt giảm giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};
