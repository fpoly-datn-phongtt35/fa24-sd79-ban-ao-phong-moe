import { Container, Grid, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "~/apis/productApi";
import { Filter } from "~/components/products/Filter";
import { TableData } from "~/components/products/TableData";
import { HeardForm } from "~/components/other/HeaderForm";

export const Product = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    handleSetProducts();
  }, []);

  const handleSetProducts = async () => {
    const res = await fetchAllProducts();
    setProducts(res.data);
  };

  return (
    <Container
      maxWidth="max-width"
      className="bg-white"
      style={{ height: "100%", marginTop: "15px" }}
    >
      <HeardForm title="Quản lý sản phẩm"/>
      {/* <Filter /> comming soon */}
      <TableData data={products}/>
    </Container>
  );
};
