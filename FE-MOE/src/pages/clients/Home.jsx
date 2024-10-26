import { Box, Grid } from "@mui/joy";
import BasicCard from "./BasicCard";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "~/apis/client/productApiClient";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
      {/* <UserCard /> */}
      <Grid marginTop={5} container spacing={1}>
        {products &&
          products?.content?.map((product, index) => (
            <Grid key={index} size={3}>
              <BasicCard product={product} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
