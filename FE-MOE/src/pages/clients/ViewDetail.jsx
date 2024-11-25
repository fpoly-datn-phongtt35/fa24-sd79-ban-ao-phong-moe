// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  Grid,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Input,
  FormLabel,
  RadioGroup,
  Sheet,
  Table,
  Divider,
  CircularProgress,
} from "@mui/joy";
import { toast } from "react-toastify";
import Radio, { radioClasses } from "@mui/joy/Radio";
import { useParams, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Done from "@mui/icons-material/Done";
import { ScrollToTop } from "~/utils/defaultScroll";
import { useContext, useEffect, useState } from "react";
import { formatCurrencyVND, formatDateWithoutTime } from "~/utils/format";
import { buyNow, fetchProduct, storeCart } from "~/apis/client/apiClient";
import { Rating } from "@mui/material";
import TopProductCard from "~/components/clients/cards/TopProductCard";
import Features from "~/components/clients/other/Features";
import FireWorkIcon from "~/assert/icon/firecracker-firework-svgrepo-com.svg";
import { CommonContext } from "~/context/CommonContext";
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import DeliveryIcon from "~/assert/icon/delivery.svg";
import ReturnIcon from "~/assert/icon/return.svg";

export const ViewDetail = () => {
  ScrollToTop();
  const context = useContext(CommonContext);

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      const res = await fetchProduct(id);
      setProduct(res.data);
      setImage(res.data.imageUrl[0]);
    };
    getProduct();
  }, [id]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? "" : Math.min(Number(value), 1000);
      setQuantity(numericValue);
    }
  };

  const handleAddToCart = async () => {
    if (!color) {
      toast.error("Vui lòng chọn màu");
      return;
    } else if (!size) {
      toast.error("Vui lòng chọn size");
      return;
    } else if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    } else {
      setLoadingAdd(true);
      await storeCart({
        productId: id,
        sizeId: size,
        colorId: color,
        quantity: quantity,
        username: localStorage.getItem("username"),
      })
        .then(() => {
          toast.success("Sản phẩm đã được thêm vào giỏ hàng");
          context.handleFetchCarts();
        })
        .finally(() => setLoadingAdd(false));
    }
  };

  const handleBuyNow = async () => {
    if (!color) {
      toast.error("Vui lòng chọn màu");
      return;
    } else if (!size) {
      toast.error("Vui lòng chọn size");
      return;
    } else if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    } else {
      let data = {
        productId: id,
        sizeId: size,
        colorId: color,
        quantity: quantity,
        username: localStorage.getItem("username"),
      };
      setLoadingBuy(true);
      await buyNow(data)
        .then((res) => {
          if (res.data.productCart.quantity <= 0) {
            toast.error("Sản phẩm đã hết hàng");
          } else {
            localStorage.setItem("orderItems", JSON.stringify([res.data]));
            navigate("/checkout");
          }
        })
        .finally(() => setLoadingBuy(false));
    }
  };

  if (!product) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="95vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid
        container
        spacing={2}
        alignItems="center"
        marginLeft={15}
        height={"50px"}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Link>
          <Typography level="title-md" noWrap>
            {product?.name}
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Grid
          container
          spacing={2}
          sx={{
            ml: 4,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid xs={12} sm={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[...new Set(product?.imageUrl)]?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="Product thumbnail"
                  width="100%"
                  style={{
                    objectFit: "cover",
                    height: image === url ? "120px" : "100px",
                    border: image === url ? "3px solid #f47439" : "",
                  }}
                  onMouseOver={() => setImage(url)}
                />
              ))}
            </Box>
          </Grid>

          <Grid xs={12} sm={5}>
            <img
              src={image}
              alt="Main product"
              width="100%"
              style={{ objectFit: "cover", height: "100%" }}
            />
          </Grid>

          <Grid xs={12} sm={4} sx={{ ml: 5 }}>
            <Typography variant="h4" level="title-lg" gutterBottom>
              {product?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating
                name="read-only"
                value={product && product.rate}
                readOnly
                precision={0.5}
              />
              <Typography variant="body2" color="neutral">
                ({product?.rateCount} lượt đánh giá)
              </Typography>
              <Typography variant="body2" level="title-sm" color="success">
                Còn hàng
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: product?.percent !== null && "#c45f1c21",
              }}
            >
              {product?.percent !== null && (
                <Box
                  marginBottom={2}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#f47439",
                    borderRadius: 4,
                    padding: 3,
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                    backgroundImage: "linear-gradient(45deg, #ff5733, #ffbc33)",
                    animation: "pulse 2s infinite",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      textShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)",
                    }}
                    level="title-lg"
                  >
                    <SvgIconDisplay icon={FireWorkIcon} /> Kết thúc vào ngày
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      textShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)",
                    }}
                    level="title-lg"
                  >
                    {product?.expiredDate &&
                      formatDateWithoutTime(product?.expiredDate)}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  zIndex: 2,
                  marginBottom: 3,
                }}
              >
                <Typography
                  color={product?.percent !== null ? "danger" : "inherit"}
                  fontWeight="bold"
                  sx={{
                    marginRight: "12px",
                    padding: product?.percent !== null ? "12px 18px" : "0",
                    borderRadius: "10px",
                    color: product?.percent !== null ? "#ff6f61" : "#333",
                    fontSize: product?.percent !== null ? "1.4rem" : "1.1rem",
                  }}
                  level="h4"
                >
                  {formatCurrencyVND(product?.discountPrice)}
                </Typography>
                {product?.percent !== null && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        textDecoration: "line-through",
                        color: "#999",
                        fontSize: "1.1rem",
                        marginRight: "8px",
                        fontWeight: "500",
                      }}
                    >
                      {formatCurrencyVND(product?.retailPrice)}
                    </Typography>
                    <Typography
                      color="primary"
                      level="title-sm"
                      sx={{
                        color: "#ff6f61",
                        fontWeight: "bold",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "1rem",
                      }}
                    >
                      -{product?.percent}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Typography variant="h3" sx={{ mb: 3 }}>
              Đã bán: {product?.purchase == null ? 0 : product?.purchase}
            </Typography>

            <Box sx={{ resize: "horizontal", overflow: "auto", px: 1 }}>
              <FormLabel
                id="product-color-attribute"
                sx={{
                  mb: 1.5,
                  fontWeight: "xl",
                  textTransform: "uppercase",
                  fontSize: "xs",
                  letterSpacing: "0.1em",
                }}
              >
                Color
              </FormLabel>
              <RadioGroup
                aria-labelledby="product-color-attribute"
                defaultValue="warning"
                sx={{ gap: 2, flexWrap: "wrap", flexDirection: "row" }}
              >
                {product &&
                  product?.colors.map((color) => (
                    <Sheet
                      key={color.id}
                      sx={{
                        position: "relative",
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        bgcolor: color.hex_code,
                        border: "1px solid #dde4ea",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        [`& .${radioClasses.checked}`]: {
                          [`& .${radioClasses.label}`]: {
                            fontWeight: "lg",
                          },
                          [`& .${radioClasses.action}`]: {
                            "--variant-borderWidth": "2px",
                            borderColor: "text.secondary",
                            border: "2px solid gray",
                          },
                        },

                        [`& .${radioClasses.action}.${radioClasses.focusVisible}`]:
                          {
                            outlineWidth: "2px",
                          },
                      }}
                    >
                      <Radio
                        overlay
                        variant="solid"
                        checkedIcon={<Done fontSize="xl2" />}
                        value={color.id}
                        onChange={(e) => setColor(e.target.value)}
                        slotProps={{
                          input: { "aria-label": color.name },
                          radio: {
                            sx: {
                              display: "contents",
                              "--variant-borderWidth": "2px",
                            },
                          },
                        }}
                        sx={{
                          "--joy-focus-outlineOffset": "4px",
                          "--joy-palette-focusVisible": color.hex_code,
                          [`& .${radioClasses.action}.${radioClasses.focusVisible}`]:
                            {
                              outlineWidth: "2px",
                            },
                        }}
                      />
                    </Sheet>
                  ))}
              </RadioGroup>
              <br />
              <FormLabel
                id="product-size-attribute"
                sx={{
                  mb: 1.5,
                  fontWeight: "xl",
                  textTransform: "uppercase",
                  fontSize: "xs",
                  letterSpacing: "0.1em",
                }}
              >
                Size
              </FormLabel>
              <RadioGroup
                aria-labelledby="product-size-attribute"
                defaultValue="M"
                sx={{ gap: 2, mb: 2, flexWrap: "wrap", flexDirection: "row" }}
              >
                {product &&
                  product?.sizes?.map((size) => (
                    <Sheet
                      key={size.id}
                      sx={{
                        position: "relative",
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "--joy-focus-outlineOffset": "4px",
                        "--joy-palette-focusVisible": (theme) =>
                          theme.vars.palette.neutral.outlinedBorder,
                        [`& .${radioClasses.checked}`]: {
                          [`& .${radioClasses.label}`]: {
                            fontWeight: "lg",
                          },
                          [`& .${radioClasses.action}`]: {
                            "--variant-borderWidth": "2px",
                            borderColor: "text.secondary",
                          },
                        },
                        [`& .${radioClasses.action}.${radioClasses.focusVisible}`]:
                          {
                            outlineWidth: "2px",
                          },
                      }}
                    >
                      <Radio
                        color="neutral"
                        overlay
                        disableIcon
                        onChange={(e) => setSize(e.target.value)}
                        value={size.id}
                        label={size.name}
                      />
                    </Sheet>
                  ))}
              </RadioGroup>
            </Box>

            <Box>
              <Typography level="body-lg" color="neutral" marginBottom={1}>
                Số lượng
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                  border: "1px solid #ccc",
                  width: 140,
                  backgroundColor: "#fafafa",
                }}
              >
                <Button
                  variant="plain"
                  size="sm"
                  color="neutral"
                  onClick={handleDecrement}
                  sx={{ minWidth: "40px", padding: "0" }}
                >
                  <RemoveIcon />
                </Button>
                <Input
                  value={quantity}
                  onChange={handleChange}
                  sx={{
                    textAlign: "center",
                    width: "60px",
                    border: "none",
                    backgroundColor: "#fafafa",
                  }}
                />
                <Button
                  variant="plain"
                  size="sm"
                  color="neutral"
                  onClick={handleIncrement}
                  sx={{ minWidth: "40px", padding: "0" }}
                >
                  <AddIcon />
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button
                variant="soft"
                color="primary"
                sx={{ flex: 2 }}
                startDecorator={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                loading={loadingAdd}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{ flex: 1 }}
                onClick={handleBuyNow}
                loading={loadingBuy}
              >
                Mua ngay
              </Button>
            </Box>
            <Box
              sx={{
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box sx={{ mr: 5 }}>
                  <SvgIconDisplay icon={DeliveryIcon} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Giao hàng miễn phí:
                  </Typography>
                  <Typography variant="body2">
                    Giao hàng miễn phí cho tất cả các đơn hàng trên 100.000 VNĐ
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ mr: 5 }}>
                  <SvgIconDisplay icon={ReturnIcon} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Giao hàng trả lại:
                  </Typography>
                  <Typography variant="body2">
                    Giao hàng miễn phí trong vòng 30 ngày.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Grid
          container
          spacing={2}
          maxWidth="lg"
          sx={{
            ml: 10,
          }}
        >
          <Grid xs={12}>
            <Typography color="neutral" level="h4" sx={{ mb: 3 }}>
              Chi tiết sản phẩm
            </Typography>
            <Box sx={{ mb: 3 }} maxWidth={true}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <Box
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography level="body-md">Danh mục:</Typography>
                  <Typography level="body-md">{product?.category}</Typography>
                </Box>
                <Box
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography level="body-md">Thương hiệu:</Typography>
                  <Typography level="body-md">{product?.brand}</Typography>
                </Box>
                <Box
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography level="body-md">Chất liệu:</Typography>
                  <Typography level="body-md">{product?.material}</Typography>
                </Box>
                <Box
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography level="body-md">Xuất xứ:</Typography>
                  <Typography level="body-md">{product?.origin}</Typography>
                </Box>
                <Box
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography level="body-md">Số lượng tồn kho:</Typography>
                  <Typography level="body-md">{product?.quantity}</Typography>
                </Box>
                <Typography level="body-md">Hướng dẫn chọn size: </Typography>
              </Box>
              <Sheet>
                <Table borderAxis="both">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chiều dài</th>
                      <th>Chiều rộng</th>
                      <th>Độ dài tay áo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product &&
                      product?.sizes?.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.length}</td>
                          <td>{item.width}</td>
                          <td>{item.sleeve}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Sheet>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Typography color="neutral" level="h4" sx={{ mb: 3 }}>
              Mô tả
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Typography
                component="div"
                sx={{
                  whiteSpace: "pre-wrap",
                  width: 1500,
                  padding: 1,
                  borderColor: "divider",
                }}
              >
                {product?.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Grid
          container
          spacing={2}
          maxWidth="lg"
          sx={{
            ml: 10,
          }}
        >
          <Grid xs={12}>
            <Typography color="neutral" level="h4" sx={{ mb: 3 }}>
              Sản phẩm liên quan
            </Typography>
            <Box spacing={2} justifyContent="start" display="flex">
              <Grid marginTop={2} container spacing={2}>
                {product &&
                  product?.relatedItem?.map((product, index) => (
                    <Grid key={index} xs={12} sm={6} md={3} lg={2}>
                      <TopProductCard product={product} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
            <Box sx={{ margin: 3, display: "flex", justifyContent: "center" }}>
              <Button
                color="neutral"
                variant="soft"
                onClick={() => navigate("/")}
              >
                Xem thêm
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Divider sx={{ my: 1, width: "100%" }} />
        <Features />
      </Box>
    </Box>
  );
};
