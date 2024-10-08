import { Container, Box, Stack, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "~/apis/productApi";
import { Filter } from "~/components/products/Filter";
import { TableData } from "~/components/products/TableData";
import { HeardForm } from "~/components/other/HeaderForm";
import debounce from "lodash.debounce";

export const Product = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ACTIVE")
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
  }
  return (
    <Container
      maxWidth="max-width"
      className="bg-white"
      style={{ height: "100%", marginTop: "15px" }}
    >
      <HeardForm title="Quản lý sản phẩm" />
      <Filter onChangeSearch={onChangeSearch} status={status} onChangeStatus={onChangeStatus}/>
      <TableData data={products.content} />
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
