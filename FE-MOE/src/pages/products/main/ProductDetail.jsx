import {
  Breadcrumbs,
  Container,
  ImageList,
  ImageListItem,
  Link,
} from "@mui/material";
import { Grid, Box, Typography, Button } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProduct, postProductImage, removeImage } from "~/apis/productApi";
import { ModifyProduct } from "~/components/products/ModifyProduct";
import { TableDetails } from "~/components/products/TableDetails";
import { IconButton } from "@mui/material";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { styled } from "@mui/joy";
import { toast } from "react-toastify";
import { ZoomImage } from "~/components/products/ZoomImage";
import { MoeAlert } from "~/components/other/MoeAlert";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
export const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [isHandleImage, setIsHandleImage] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpen = (url) => {
    setUrl(url);
    setOpen(true);
  };
  const handleClose = () => {
    setUrl("");
    setOpen(false);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    const res = await fetchProduct(id);
    setProduct(res.data);
  };

  const onUploadImage = async (file) => {
    if (product?.imageUrl.length >= 5) {
      toast.error("Số lượng ảnh tối đa là 5");
      return;
    }
    setIsHandleImage(true);
    let formData = new FormData();
    formData.append("productId", id);
    formData.append("images", file.target.files[0]);
    await postProductImage(formData).then(() => {
      getProduct();
      setIsHandleImage(false);
      toast.success("Thêm thành công");
    });
  };

  const onRemoveImage = async (publicId) => {
    await removeImage(publicId).then(() => getProduct());
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
          Thông tin sản phẩm
        </Typography>
      </Breadcrumbs>
      <Box marginTop={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography color="neutral" level="title-lg" noWrap variant="plain">
            Thông tin sản phẩm
          </Typography>
          <Button
            loading={isHandleImage}
            component="label"
            role={undefined}
            tabIndex={-1}
            startDecorator={<BackupOutlinedIcon />}
            variant="plain"
          >
            Upload a image
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={onUploadImage}
            />
          </Button>
        </Box>
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
                  <ImageListItem key={index} style={{ position: "relative" }}>
                    <img
                      srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                      loading="lazy"
                      onClick={() => handleOpen(item.url)}
                    />
                    <ZoomImage
                      handleClose={handleClose}
                      open={open}
                      url={url}
                    />
                    {product?.imageUrl.length > 1 && (
                      <MoeAlert
                        title="Xóa ảnh sản phẩm"
                        message="Bạn có muốn xóa ảnh này không?"
                        event={() => onRemoveImage(item.publicId)}
                        button={
                          <IconButton
                            aria-label="delete"
                            style={{
                              position: "absolute",
                              top: -10,
                              right: 0,
                              color: "#ffff",
                            }}
                          >
                            <HighlightOffTwoToneIcon />
                          </IconButton>
                        }
                      />
                    )}
                  </ImageListItem>
                ))}
            </ImageList>
          </Grid>
        </Grid>
      </Box>
      <TableDetails data={product} getProduct={getProduct} />
    </Container>
  );
};
