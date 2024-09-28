import { Container } from "react-bootstrap";

export const Product = () => {
  return (
    <Container className="bg-white" style={{ height: "100%" }}>
      <div className="fs-3">
        <span className="fw-bold">Quản lý sản phẩm</span>
      </div>

      <hr />

      <div className="mb-5">
        <button className="btn btn-danger">
          Thêm sản phẩm mới <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Ảnh</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Loại sản phẩm</th>
              <th scope="col">Thương hiệu</th>
              <th scope="col">Chất liệu</th>
              <th scope="col">Giá</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </table>

        <div className="d-flex align-items-center justify-content-center">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  Prev
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Container>
  );
};
