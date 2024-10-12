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
import HomeIcon from '@mui/icons-material/Home';
import { fetchAllProducts, moveToBin, changeStatus } from "~/apis/productApi";
import { Filter } from "~/components/products/Filter";
import { TableData } from "~/components/products/TableData";
import { HeardForm } from "~/components/other/HeaderForm";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

export const Product = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    handleSetProducts();
  }, [currentPage, keyword, status]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSetProducts = async () => {
    const res = await fetchAllProducts(currentPage, keyword, status);
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
    setStatus(e.target.value);
  };

  const onMoveToBin = (id) => {
    swal({
      title: "Xác nhận",
      text: "Bạn có muốn chuyển sản phẩm vào kho lưu trữ không?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        handleSetProducts();
        moveToBin(id);
      }
    });
  };

  const onSetStatus = (id, status) => {
    console.log(id, !status ? "ACTIVE" : "INACTIVE");
    changeStatus(id, !status ? "ACTIVE" : "INACTIVE");
  };

  if (!products.content) {
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
      sx={{ height: "100%", marginTop: "15px", backgroundColor: "#f5f5f5"}}
    >
      {/* <HeardForm title="Quản lý sản phẩm" /> */}

      <Grid
        container
        spacing={2}
        alignItems="center"
        bgcolor={"#1976d2"}
        height={"50px"}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{color: "#fff", marginLeft: "5px"}}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Typography sx={{ color: "text.white", cursor: "pointer" }}>
            Quản lý sản phẩm
          </Typography>
        </Breadcrumbs>
      </Grid>

      <Filter
        onChangeSearch={onChangeSearch}
        status={status}
        onChangeStatus={onChangeStatus}
      />

      <TableData
        data={products.content}
        onMoveToBin={onMoveToBin}
        onSetStatus={onSetStatus}
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={3}
      >
        {products.totalPages > 1 && (
          <Stack spacing={2}>
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
