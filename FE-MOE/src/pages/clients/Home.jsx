import { Box, Divider, Grid, Typography } from "@mui/joy";
import BasicCard from "./BasicCard";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "~/apis/client/productApiClient";
import SlideSlideShowHeader from "~/components/events/SlideShowEventHeader";
import { ProductCard } from "~/components/cards/ProductCard";
import TopProductCard from "~/components/cards/TopProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [origin, setOrigin] = useState("");

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
    setCurrentPage,
  ]);

  const handleSetProducts = async () => {
    const res = await fetchAllProducts(
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

  return (
    <Box>
      <Box>
        <SlideSlideShowHeader />
      </Box>
      <Box
        sx={{
          padding: 4,
        }}
      >
        <Typography level="title-lg">Sản Phẩm Bán Chạy</Typography>
        <Divider sx={{ my: 1, width: "100%", maxWidth: "100%" }} />
        <Grid marginTop={2} container spacing={2}>
          {products &&
            products?.content?.map((product, index) => (
              <Grid key={index} size={1}>
                <TopProductCard product={product} />
              </Grid>
            ))}
        </Grid>
      </Box>
      <Box
        sx={{
          padding: 4,
          marginTop: 2,
        }}
      >
        <Typography level="title-lg">Sản Phẩm Nổi Bật</Typography>
        <Divider sx={{ my: 1, width: "100%", maxWidth: "100%" }} />
        <Grid marginTop={2} container spacing={2}>
          {products &&
            products?.content?.map((product, index) => (
              <Grid key={index} size={1}>
                <ProductCard product={product} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
