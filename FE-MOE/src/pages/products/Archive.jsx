import {
  Container,
  Box,
  Stack,
  Pagination,
  CircularProgress,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import {
  changeStatus,
  attributeProducts,
  fetchAllProductArchives,
  productRestore,
  deleteForever,
} from "~/apis/productApi";
import { Filter } from "~/components/products/Filter";
import { TableData } from "~/components/products/TableData";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

export const Archive = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [origin, setOrigin] = useState("");

  const [attributes, setAttribute] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    handleSetProducts();
  }, [
    currentPage,
    pageSize,
    keyword,
    status,
    category,
    brand,
    material,
    origin,
  ]);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    const res = await attributeProducts();
    setAttribute(res);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSetProducts = async () => {
    const res = await fetchAllProductArchives(
      currentPage,
      pageSize,
      keyword,
      status,
      category,
      brand,
      material,
      origin
    );
    setProducts(res.data);
  };

  const debouncedSearch = debounce((value) => {
    setKeyword(value);
    setCurrentPage(1);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const onChangeStatus = (e) => {
    setCurrentPage(1);
    setStatus(e);
  };

  const onChangeCategory = (e) => {
    setCurrentPage(1);
    setCategory(e);
  };
  const onChangeBrand = (e) => {
    setCurrentPage(1);
    setBrand(e);
  };
  const onChangeMaterial = (e) => {
    setCurrentPage(1);
    setMaterial(e);
  };
  const onChangeOrigin = (e) => {
    setCurrentPage(1);
    setOrigin(e);
  };

  const handleSetPageSize = (value) => {
    setCurrentPage(1);
    setPageSize(value);
  };
  const clearFilter = () => {
    setCurrentPage(1);
    setKeyword("");
    setStatus("ALL");
    setCategory("");
    setBrand("");
    setMaterial("");
    setOrigin("");
  };

  const handleDeleteForerver = (id) => {
    swal({
      title: "Xác nhận",
      text: "Xóa vĩnh viễn sản phẩm này không?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        deleteForever(id).then(() => {
          setCurrentPage(1);
          handleSetProducts();
        });
      }
    });
  };

  const handleRestoreProduct = (id) => {
    swal({
      title: "Xác nhận",
      text: "Bạn có muốn khôi phục sản phẩm này không?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        productRestore(id).then(() => {
          setCurrentPage(1);
          handleSetProducts();
        });
      }
    });
  };

  const onSetStatus = (id, status) => {
    changeStatus(id, !status ? "ACTIVE" : "INACTIVE");
  };

  if (!products?.content) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        width="80vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="max-width"
      sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}
    >
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
            Kho lưu trữ sản phẩm
          </Typography>
        </Breadcrumbs>
      </Grid>

      <Filter
        btnAdd={false}
        onChangeSearch={onChangeSearch}
        keyword={keyword}
        status={status}
        category={category}
        brand={brand}
        material={material}
        attributes={attributes}
        origin={origin}
        onChangeStatus={onChangeStatus}
        onChangeCategory={onChangeCategory}
        onChangeBrand={onChangeBrand}
        onChangeMaterial={onChangeMaterial}
        onChangeOrigin={onChangeOrigin}
        clearFilter={clearFilter}
      />

      <TableData
        restore={true}
        data={products.content}
        onRestoreProduct={handleRestoreProduct}
        onDeleteForerver={handleDeleteForerver}
        onSetStatus={onSetStatus}
        onSetPageSize={handleSetPageSize}
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={3}
      >
        {products.totalPages > 1 && (
          <Stack>
            <Pagination
              count={products.totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        )}
      </Box>
    </Container>
  );
};
