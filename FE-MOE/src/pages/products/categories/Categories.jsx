import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { fetchAllCategories, postCategory, deleteCategory } from "~/apis/categoriesApi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export const Categories = () => {
  const [categories, setCategories] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    handleSetCategories();
  }, []);

  const handleSetCategories = async () => {
    const res = await fetchAllCategories();
    setCategories(res.data);
  };

  const onSubmit = async (data) => {
    console.log(data);
    await postCategory({
        name: data.name,
        userId: localStorage.getItem('userId')
    });
    handleSetCategories();
  };

  const ondelete = async (id) => {
    await deleteCategory(id);
    handleSetCategories();
  }

  return (
    <Container className="bg-white" style={{ height: "100%" }}>
      <div className="fs-5">
        <span className="fw-bold">Quản lý danh mục</span>
      </div>
      <hr />
      <div className="mb-5 row">
        <div className="col-6">
          <input
            type="search"
            className="form-control"
            placeholder="Nhập tên danh mục..."
          />
        </div>
        <div className="col text-end ">
          <form onSubmit={handleSubmit(onSubmit)} className="row">
            <input
              type="text"
              className="form-control col me-2"
              placeholder="Nhập tên danh mục mới..."
              defaultValue=""
              {...register("name", { required: true })}
            />
            <button type="submit" className="btn btn-outline-secondary col-4">
              Thêm danh mục mới <i className="fa-solid fa-plus"></i>
            </button>
          </form>
        </div>
      </div>

      <div>
        <table className="table">
          <thead>
            <tr className="text-center">
              <th scope="col">#</th>
              <th scope="col">Tên danh mục</th>
              <th scope="col">Sản phẩm</th>
              <th scope="col">Ngày tạo</th>
              <th scope="col">Ngày sửa</th>
              <th scope="col">Người tạo</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((category, index) => (
                <tr key={index} className="text-center">
                  <th scope="row">{index + 1}</th>
                  <td>{category.name}</td>
                  <td>{category.productCount}</td>
                  <td>{category.createdAt}</td>
                  <td>{category.updatedAt}</td>
                  <td>{category.createdBy}</td>
                  <td className="text-center">
                    <button className="btn">
                      <i className="fa-solid fa-square-pen text-warning"></i>
                    </button>
                    <button className="btn"  onClick={() => ondelete(category.id)}>
                      <i className="fa-solid fa-trash text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};
