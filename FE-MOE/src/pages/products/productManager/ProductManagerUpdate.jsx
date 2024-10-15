import {
  Breadcrumbs,
  Container,
  ImageList,
  ImageListItem,
  Link,
} from "@mui/material";
import { Grid, Box, Typography } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProduct } from "~/apis/productApi";
import { ModifyProduct } from "~/components/products/ModifyProduct";
import { TableDetails } from "~/components/products/TableDetails";

export const ProductManagerUpdate = () => {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    const res = await fetchProduct(id);
    setProduct(res.data);
  };

  return (
    <Container
      maxWidth="max-width"
      style={{ height: "100%", marginTop: "15px" }}
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
        <Link
          underline="hover"
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          color="inherit"
          onClick={() => navigate("/product")}
        >
          Quản lý sản phẩm
        </Link>
        <Typography sx={{ color: "text.white", cursor: "pointer" }}>
          Cập nhật sản phẩm
        </Typography>
      </Breadcrumbs>
      <Box marginTop={3}>
        <Typography color="neutral" level="title-lg" noWrap variant="plain">
          Thông tin sản phẩm
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 2,
            justifyContent: "space-between",
            border: "1px solid #d2d0d1",
            borderRadius: "5px",
          }}
          marginTop={1}
        >
          <Grid size={3}>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
                maxWidth={300}
              >
                Tên sản phẩm: {product?.name}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Xuất sứ: {product?.origin}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Thương hiệu: {product?.brand.name}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Danh mục: {product?.category.name}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Chất liệu: {product?.material.name}
              </Typography>
            </Box>
          </Grid>

          <Grid size={3}>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Người tạo: {product?.created_by}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Ngày tạo: {product?.created_at}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Người sửa: {product?.modified_by}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                color="neutral"
                level="title-md"
                noWrap={false}
                variant="plain"
              >
                Ngày sửa: {product?.modified_at}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <ModifyProduct data={product} id={id} getProduct={getProduct} />
            </Box>
          </Grid>

          <Grid size={3}>
            <ImageList
              sx={{ width: 400, height: 150 }}
              cols={3}
              rowHeight={164}
            >
              {product?.imageUrl?.length > 0 &&
                product?.imageUrl.map((item, index) => (
                  <ImageListItem key={index}>
                    <img
                      srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item}?w=164&h=164&fit=crop&auto=format`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
            </ImageList>
          </Grid>
        </Grid>
      </Box>
      <TableDetails data={product} getProduct={getProduct}/>
    </Container>
  );
};
